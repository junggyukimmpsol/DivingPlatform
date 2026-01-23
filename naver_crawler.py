import asyncio
from playwright.async_api import async_playwright
import sys
import argparse
import time
import json
import re
import os
import requests

def sanitize_filename(filename):
    """Sanitize the filename to be used as a folder name."""
    return re.sub(r'[\\/*?:"<>|]', "", filename).strip()

async def scrape_naver_smartstore(url):
    review_data = []
    product_info = {'name': 'N/A', 'price': 'N/A', 'description': []}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            viewport={'width': 1280, 'height': 800}
        )
        page = await context.new_page()

        try:
            print(f"Navigating to {url}...")
            await page.goto(url, wait_until="networkidle", timeout=60000)

            # Check for CAPTCHA
            if "captcha" in page.url or "captcha" in (await page.content()).lower():
                print("\n[!] CAPTCHA detected. Please solve it in the browser window if prompted.")
                await page.wait_for_selector('h3[class*="DCVBehA8ZB"], h3', timeout=120000)

            # 1. Scrape Product Basic Info
            try:
                name_el = await page.wait_for_selector('h3[class*="DCVBehA8ZB"], h3', timeout=10000)
                product_info['name'] = await name_el.inner_text()
            except: pass

            try:
                price_el = await page.query_selector('span[class*="e1DMQNBPJ_"], ._1LY7_y9_yG')
                if price_el: product_info['price'] = await price_el.inner_text()
            except: pass

            print(f"Product: {product_info['name']} | Price: {product_info['price']}")

            # 2. Scrape Detailed Description (Text + Images)
            print("Scraping detailed description content...")
            await page.evaluate("window.scrollTo(0, 1000)")
            await page.wait_for_timeout(1000)
            await page.evaluate("window.scrollTo(0, 3000)")
            await page.wait_for_timeout(1000)

            container = await page.query_selector('.se-main-container') or \
                        await page.query_selector('#INTRODUCE')

            if container:
                items = await container.query_selector_all('.se-component, .se-section')
                for item in items:
                    item_type = await item.get_attribute('class')

                    if 'se-text' in item_type:
                        text = await item.inner_text()
                        if text.strip():
                            product_info['description'].append({"type": "text", "content": text.strip()})

                    elif 'se-image' in item_type or await item.query_selector('img'):
                        imgs = await item.query_selector_all('img')
                        for img in imgs:
                            src = await img.get_attribute('src')
                            data_src = await img.get_attribute('data-src')
                            img_url = data_src or src
                            if img_url and 'http' in img_url:
                                product_info['description'].append({"type": "image", "content": img_url})

            # 3. Go to Reviews Tab
            print("Looking for 'Reviews' tab...")
            review_tab = page.get_by_text("상품리뷰", exact=False).first
            await review_tab.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)

            if await review_tab.is_visible():
                print("Clicking 'Reviews' tab...")
                await review_tab.click()
                await page.wait_for_timeout(3000)
            else:
                await page.evaluate("window.scrollTo(0, 4000)")
                await page.wait_for_timeout(2000)
                review_tab = page.get_by_text("상품리뷰", exact=False).first
                if await review_tab.is_visible():
                    await review_tab.click()
                    await page.wait_for_timeout(3000)

            # 4. Scrape Reviews (Limit 10)
            print("Scraping top 10 reviews...")
            review_items = await page.query_selector_all('li[class*="ReviewList_item"]') or \
                           await page.query_selector_all('li.V5XROudBPi')

            target_items = review_items[:10]
            for item in target_items:
                try:
                    rating_el = await item.query_selector('em')
                    rating = re.search(r'\d', await rating_el.inner_text()).group(0) if rating_el else "0"
                    writer_el = await item.query_selector('strong')
                    writer = await writer_el.inner_text() if writer_el else "N/A"
                    content_el = await item.query_selector('span[class*="ReviewContent"]') or \
                                 await item.query_selector('div[class*="ReviewContent"]')
                    content = await content_el.inner_text() if content_el else "N/A"
                    date_match = re.search(r'\d{2}\.\d{2}\.\d{2}\.', await item.inner_text())
                    date = date_match.group(0) if date_match else "N/A"

                    review_data.append({
                        "writer": writer, "rating": rating, "date": date, "content": content.strip().replace('\n', ' ')
                    })
                except: continue

        except Exception as e:
            print(f"Error: {e}")
        finally:
            # Directory and File Storage
            base_folder = "crawled_data"
            sub_folder = sanitize_filename(product_info['name'])
            target_dir = os.path.join(base_folder, sub_folder)
            desc_dir = os.path.join(target_dir, "description")

            os.makedirs(target_dir, exist_ok=True)
            os.makedirs(desc_dir, exist_ok=True)

            # Save Description Blocks as Individual Files
            print(f"\nSaving description files to {desc_dir}...")
            for i, block in enumerate(product_info['description'], 1):
                filename_prefix = f"{i:02d}"
                if block['type'] == 'text':
                    filepath = os.path.join(desc_dir, f"{filename_prefix}_text.txt")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(block['content'])
                elif block['type'] == 'image':
                    img_url = block['content']
                    # Try to guess extension
                    ext = ".jpg"
                    if "png" in img_url.lower(): ext = ".png"
                    elif "webp" in img_url.lower(): ext = ".webp"

                    filepath = os.path.join(desc_dir, f"{filename_prefix}_image{ext}")
                    try:
                        img_data = requests.get(img_url, timeout=10).content
                        with open(filepath, 'wb') as f:
                            f.write(img_data)
                    except:
                        print(f"Failed to download image: {img_url}")

            # Save Main JSON (Reviews and Basic Info)
            result = {
                "product": {
                    "name": product_info['name'],
                    "price": product_info['price']
                },
                "reviews": review_data,
                "crawled_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }

            output_file = os.path.join(target_dir, "product_data.json")
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

            print(f"\n[SUCCESS] Saved data to: {target_dir}")
            print(f"Total files saved in description: {len(product_info['description'])}")

            print("\nClosing browser in 5 seconds...")
            await asyncio.sleep(5)
            await browser.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('url')
    args = parser.parse_args()
    asyncio.run(scrape_naver_smartstore(args.url))
