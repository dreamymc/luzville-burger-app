import os
import sys
from playwright.sync_api import sync_playwright

def test_homepage():
    print("🚀 Starting Luzville Burger App test...")
    with sync_playwright() as p:
        # Launch headless Chromium
        print("🔧 Launching browser...")
        browser = p.chromium.launch(headless=True)
        
        # Open page
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        
        print("🌐 Navigating to http://localhost:3000...")
        try:
            page.goto('http://localhost:3000')
        except Exception as e:
            print(f"❌ Error navigating: {e}")
            browser.close()
            sys.exit(1)
            
        print("⏳ Waiting for network to be idle...")
        page.wait_for_load_state('networkidle')
        
        # Verify title
        title = page.title()
        print(f"📄 Page Title: '{title}'")
        if "Luzville" not in title:
            print("❌ Title verification failed!")
            browser.close()
            sys.exit(1)
            
        # Verify shop name header
        print("🔍 Checking header...")
        header_locator = page.locator('header')
        if header_locator.count() > 0:
            header_text = header_locator.inner_text()
            print(f"✅ Header text: '{header_text.splitlines()[0] if header_text else 'None'}'")
        else:
            print("❌ Header element not found!")
            browser.close()
            sys.exit(1)
            
        # Verify footer marquee
        print("🔍 Checking footer...")
        footer_locator = page.locator('footer')
        if footer_locator.count() > 0:
            print("✅ Footer element is present.")
        else:
            print("❌ Footer element not found!")
            browser.close()
            sys.exit(1)
            
        # Take a screenshot to verify visual correctness
        screenshot_path = "customer_page_desktop.png"
        print(f"📸 Taking screenshot and saving to {screenshot_path}...")
        page.screenshot(path=screenshot_path, full_page=True)
        
        print("🎉 All checks passed successfully!")
        browser.close()

if __name__ == "__main__":
    test_homepage()
