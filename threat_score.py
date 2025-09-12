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
            model="gpt-4o-mini",
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
                return 0