import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import sys
import json
import os

async def fetch_and_parse(url):
    print(f"Fetching {url}...")

    async with async_playwright() as p:
        # Launch with headless=False so user can see and solve CAPTCHA
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
             user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
             viewport={'width': 1280, 'height': 800}
        )
        page = await context.new_page()

        try:
            await page.goto(url, wait_until="commit", timeout=60000)

            print("\n[!] Page loaded.")
            print("[!] Please solve CAPTCHA if currently visible.")
            print("[!] Waiting for 'Reviews' tab (상품리뷰) to become available...")

            # 1. Wait for and Click Reviews Tab
            # Using a long timeout (5 mins) to give user ample time to solve CAPTCHA
            try:
                # Look for the tab that contains "상품리뷰"
                review_tab = page.get_by_text("상품리뷰", exact=False).first
                await review_tab.wait_for(state="visible", timeout=300000)

                print("[!] 'Reviews' tab found! Clicking...")
                await review_tab.click()

                # Wait for review content to load after click
                await page.wait_for_timeout(2000)

            except Exception as e:
                print(f"[ERROR] Could not find or click 'Reviews' tab: {e}")
                # We might still try to scrape if we are already on the right page, so valid to continue or return

            # 2. Wait for Target Content
            target_class = "MX91DFZo2F"
            print(f"[!] Waiting for element with class '{target_class}' to appear...")

            try:
                await page.wait_for_selector(f'.{target_class}', timeout=30000)
                print("\n[SUCCESS] Target content detected!")
            except Exception as e:
                print(f"\n[WARNING] Timed out waiting for class '{target_class}'. Saving what we have...")

            # Wait a bit more for full rendering
            await page.wait_for_timeout(2000)

            # Extract Product Name for Filename
            product_name = "Unknown_Product"
            try:
                # Try common Naver Smart Store title selectors
                title_el = await page.query_selector('h3[class*="DCVBehA8ZB"]') or \
                           await page.query_selector('h3._22kNQu19qU') or \
                           await page.query_selector('h3')
                if title_el:
                    product_name = await title_el.inner_text()
                    product_name = product_name.strip()
            except Exception as e:
                print(f"[WARNING] Could not extract product name: {e}")

            # Get HTML content
            content = await page.content()

            # Save HTML
            html_filename = "last_downloaded.html"
            with open(html_filename, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Saved HTML to {html_filename}")

            # Parse HTML
            parse_html_content(content, target_class, product_name)

        except Exception as e:
            print(f"Error occurred: {e}")
        finally:
            print("Closing browser in 5 seconds...")
            await asyncio.sleep(5)
            await browser.close()

def sanitize_filename(filename):
    """Sanitize the filename to be used as a file name."""
    import re
    return re.sub(r'[\\/*?:"<>|]', "", filename).strip()

def parse_html_content(html_content, target_class, product_name):
    soup = BeautifulSoup(html_content, 'html.parser')

    print(f"\nParsing content for class '{target_class}'...")

    results = soup.find_all('span', class_=target_class)

    extracted_data = []

    if not results:
        print("No matches found.")
    else:
        for i, element in enumerate(results, 1):
            text = element.get_text(strip=True)
            extracted_data.append(text)
            print(f"[{i}] {text}")

    # Save to JSON
    safe_name = sanitize_filename(product_name)
    json_filename = f"{safe_name}_리뷰.json"

    with open(json_filename, "w", encoding="utf-8") as f:
        json.dump(extracted_data, f, ensure_ascii=False, indent=2)

    print(f"\n[SUCCESS] Saved {len(extracted_data)} items to {json_filename}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python simple_html_parser.py <url>")
        sys.exit(1)

    url = sys.argv[1]
    asyncio.run(fetch_and_parse(url))
