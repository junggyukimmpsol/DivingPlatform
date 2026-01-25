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

            # 2. Skip Detailed Description (As requested)
            print("Skipping detailed description scraping...")

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

            # 4. Scrape Reviews (Limit 10, Detailed)
            print("Scraping top 10 reviews...")

            # Wait for reviews to load
            await page.wait_for_selector('li[class*="ReviewList_item"], li.V5XROudBPi', timeout=10000)

            review_items = await page.query_selector_all('li[class*="ReviewList_item"]') or \
                           await page.query_selector_all('li.V5XROudBPi')

            target_items = review_items[:10]
            for i, item in enumerate(target_items):
                try:
                    print(f"Processing review {i+1}...")

                    # Click "More" button if exists to expand content
                    # Often classes like ._2sRzW, .ReviewContent_more_btn
                    more_btns = await item.query_selector_all('button[class*="more"], button[class*="ReviewContent_button"]')
                    for btn in more_btns:
                        if await btn.is_visible():
                            await btn.click()
                            await page.wait_for_timeout(300)

                    # Extract Data
                    rating_el = await item.query_selector('em')
                    rating = re.search(r'\d+', await rating_el.inner_text()).group(0) if rating_el else "0"

                    writer_el = await item.query_selector('strong')
                    writer = await writer_el.inner_text() if writer_el else "N/A"

                    # Option
                    # Often in div[class*="ReviewContent_option"] or similar
                    option = "N/A"
                    option_el = await item.query_selector('[class*="ReviewContent_option"], [class*="ReviewContent_text_option"]')
                    if option_el:
                        option = await option_el.inner_text()
                        option = option.replace("선택옵션", "").strip()

                    # Content
                    content_el = await item.query_selector('span[class*="ReviewContent"], div[class*="ReviewContent_text"]')
                    content = await content_el.inner_text() if content_el else "N/A"

                    # Date
                    date_match = re.search(r'\d{2}\.\d{2}\.\d{2}\.', await item.inner_text())
                    date = date_match.group(0) if date_match else "N/A"

                    # Images
                    images = []
                    # Review images usually in ul > li > img or div > img
                    img_els = await item.query_selector_all('img[src*="review"], img[class*="ReviewContent_image"]')
                    for img in img_els:
                        src = await img.get_attribute('src')
                        if src:
                            # Cleanup thumbnail params if needed, but keeping original is usually safer for availability
                            images.append(src)

                    review_data.append({
                        "writer": writer,
                        "rating": rating,
                        "date": date,
                        "option": option,
                        "content": content.strip(),
                        "images": images
                    })
                except Exception as e:
                    print(f"Error processing review {i+1}: {e}")
                    continue

        except Exception as e:
            print(f"Error: {e}")
        finally:
            # Directory and File Storage
            base_folder = "crawled_data"
            sub_folder = sanitize_filename(product_info['name'])
            target_dir = os.path.join(base_folder, sub_folder)

            os.makedirs(target_dir, exist_ok=True)

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
            print(f"Total reviews saved: {len(review_data)}")

            print("\nClosing browser in 5 seconds...")
            await asyncio.sleep(5)
            await browser.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('url')
    args = parser.parse_args()
    asyncio.run(scrape_naver_smartstore(args.url))
