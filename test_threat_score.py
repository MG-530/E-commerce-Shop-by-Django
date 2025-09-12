#!/usr/bin/env python3
from openai import OpenAI

class ThreatScore:
    def __init__(self, api_token):
        self.client = OpenAI(api_key=api_token)

    def run(self, text, rules):
        prompt = f"""
شما یک مدل LLM هستید. ورودی‌ها:
متن: {text}
قوانین: {rules}

وظیفه شما این است که:
1. هر کلمه یا عبارت کلیدی موجود در قوانین را در متن پیدا کنید.
2. تعداد تکرار هر کلیدواژه را محاسبه کنید (حتی اگر به صورت جمع یا تغییر شکل ظاهر شود).
3. امتیاز تهدید را با فرمول زیر محاسبه کنید:

Threat Score = مجموع (تعداد مشاهده هر کلمه × وزن آن)

فقط عدد نهایی را برگردانید.
"""

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",  # Updated model name
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        # خروجی مدل را به عدد تبدیل می‌کنیم
        answer_text = response.choices[0].message.content.strip()
        try:
            return int(answer_text)
        except ValueError:
            # اگر خروجی عدد نباشد، سعی می‌کنیم عدد را از متن استخراج کنیم
            import re
            numbers = re.findall(r'\d+', answer_text)
            if numbers:
                return int(numbers[0])
            else:
                print(f"Could not extract number from response: {answer_text}")
                return 0


def main():
    # نمونه تست
    api_token = input("لطفا API token OpenAI خود را وارد کنید: ")
    
    threat_scorer = ThreatScore(api_token)
    
    # نمونه متن و قوانین
    sample_text = "این متن حاوی کلماتی مانند خطر، تهدید و حمله است. همچنین شامل واژه‌هایی مثل امنیت و محافظت می‌باشد."
    
    sample_rules = """
    خطر: وزن 10
    تهدید: وزن 15
    حمله: وزن 20
    امنیت: وزن -5
    محافظت: وزن -3
    """
    
    print(f"متن نمونه: {sample_text}")
    print(f"قوانین: {sample_rules}")
    
    try:
        score = threat_scorer.run(sample_text, sample_rules)
        print(f"امتیاز تهدید محاسبه شده: {score}")
    except Exception as e:
        print(f"خطا در محاسبه امتیاز: {e}")


if __name__ == "__main__":
    main()