import requests
from bs4 import BeautifulSoup
import json
import re

SOURCE_URL = "http://sms-pro.guru" # Та страница со скрина
MARKUP = 1.30 # Наценка 30%

def parse_all_countries():
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(SOURCE_URL, headers=headers, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        products = []
        # Находим ВСЕ карточки стран
        cards = soup.find_all("div", class_="country-card")
        
        for card in cards:
            # Название страны из атрибута или текста
            name = card.get("data-country", "Unknown")
            
            # Количество
            count_el = card.find("span", class_="account-count")
            count = re.sub(r'\D', '', count_el.get_text()) if count_el else "0"
            
            # Цена
            price_el = card.find("span", class_="account-price")
            if price_el:
                price_raw = re.sub(r'[^\d.,]', '', price_el.get_text()).replace(',', '.')
                try:
                    price_final = f"{round(float(price_raw) * MARKUP)} ₽"
                except:
                    price_final = "Цена по запросу"
            else:
                price_final = "0 ₽"
            
            # Добавляем в список только если товар есть в наличии
            if int(count) > 0:
                products.append({
                    "name": name,
                    "stock": count,
                    "price": price_final
                })
        
        return products
    except Exception as e:
        print(f"Ошибка: {e}")
        return []

all_data = parse_all_countries()

# Сохраняем весь список в data.json
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=4)

print(f"Собрано товаров: {len(all_data)}")
