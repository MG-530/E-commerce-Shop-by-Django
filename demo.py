#!/usr/bin/env python3
"""
Demo script for ThreatScore class
This demonstrates how to use the ThreatScore class with sample data
"""
import os
from threat_score import ThreatScore

def demo():
    print("=== ThreatScore Demo ===")
    print()
    
    # Check if API key is available
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("❌ OPENAI_API_KEY environment variable not set")
        print("To run this demo, you need to set your OpenAI API key:")
        print("export OPENAI_API_KEY='your-api-key-here'")
        print()
        print("Or you can run the interactive test:")
        print("python3 test_threat_score.py")
        return
    
    # Initialize ThreatScore
    threat_scorer = ThreatScore(api_key)
    
    # Sample data
    sample_text = "این متن حاوی کلماتی مانند خطر، تهدید و حمله است. همچنین شامل واژه‌هایی مثل امنیت و محافظت می‌باشد."
    
    sample_rules = """
    خطر: وزن 10
    تهدید: وزن 15
    حمله: وزن 20
    امنیت: وزن -5
    محافظت: وزن -3
    """
    
    print("📝 Sample Text:")
    print(f"   {sample_text}")
    print()
    
    print("📋 Rules:")
    for line in sample_rules.strip().split('\n'):
        if line.strip():
            print(f"   {line.strip()}")
    print()
    
    print("🤖 Calling OpenAI API...")
    
    try:
        score = threat_scorer.run(sample_text, sample_rules)
        print(f"✅ Threat Score: {score}")
        
        # Expected calculation explanation
        print()
        print("📊 Expected calculation:")
        print("   خطر (1 occurrence) × 10 = 10")
        print("   تهدید (1 occurrence) × 15 = 15") 
        print("   حمله (1 occurrence) × 20 = 20")
        print("   امنیت (1 occurrence) × -5 = -5")
        print("   محافظت (1 occurrence) × -3 = -3")
        print("   Total: 10 + 15 + 20 - 5 - 3 = 37")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    demo()