import re
from collections import defaultdict

class ThreatScore:
    def __init__(self, api_token):
        self.api_token = api_token
    
    def run(self, text, rules):
        """
        Calculate threat score based on keywords and their weights in the text.
        
        Args:
            text (str): The text to analyze
            rules (str): Rules in format "keyword: weight, keyword: weight, ..."
        
        Returns:
            int: The calculated threat score
        """
        # Parse rules to extract keywords and their weights
        keyword_weights = self._parse_rules(rules)
        
        # Count occurrences of each keyword in the text
        keyword_counts = self._count_keywords(text, keyword_weights.keys())
        
        # Calculate threat score
        threat_score = 0
        for keyword, count in keyword_counts.items():
            if count > 0:
                weight = keyword_weights[keyword]
                threat_score += count * weight
        
        return threat_score
    
    def _parse_rules(self, rules):
        """
        Parse the rules string to extract keywords and their weights.
        
        Args:
            rules (str): Rules string in Persian format
        
        Returns:
            dict: Dictionary mapping keywords to their weights
        """
        keyword_weights = {}
        
        # Split by comma and process each rule
        rule_parts = rules.split('،')  # Persian comma
        
        for part in rule_parts:
            part = part.strip()
            if ':' in part or '：' in part:  # Handle both regular and Persian colon
                # Split by colon
                if ':' in part:
                    keyword, weight_str = part.split(':', 1)
                else:
                    keyword, weight_str = part.split('：', 1)
                
                keyword = keyword.strip()
                weight_str = weight_str.strip()
                
                # Convert Persian digits to English digits
                weight_str = self._persian_to_english_digits(weight_str)
                
                try:
                    weight = int(weight_str)
                    keyword_weights[keyword] = weight
                except ValueError:
                    continue
        
        return keyword_weights
    
    def _persian_to_english_digits(self, text):
        """Convert Persian digits to English digits."""
        persian_digits = '۰۱۲۳۴۵۶۷۸۹'
        english_digits = '0123456789'
        
        for i, persian_digit in enumerate(persian_digits):
            text = text.replace(persian_digit, english_digits[i])
        
        return text
    
    def _count_keywords(self, text, keywords):
        """
        Count occurrences of keywords in the text.
        Handles plural forms and variations.
        
        Args:
            text (str): The text to search in
            keywords (list): List of keywords to search for
        
        Returns:
            dict: Dictionary mapping keywords to their counts
        """
        keyword_counts = defaultdict(int)
        
        # Normalize text for better matching - remove ZWNJ characters and convert to lowercase
        text = text.replace('\u200c', '').lower()  # Remove Zero Width Non-Joiner
        
        for keyword in keywords:
            keyword_lower = keyword.lower().replace('\u200c', '')
            count = 0
            
            # Special handling for compound keywords (like "تماس مشکوک")
            if ' ' in keyword_lower:
                # For compound keywords, look for the phrase with possible variations
                # Handle both exact matches and plural forms
                word_parts = keyword_lower.split()
                first_word = word_parts[0]
                rest_of_phrase = ' '.join(word_parts[1:])
                
                # Pattern variations for compound phrases
                compound_patterns = [
                    rf'{re.escape(keyword_lower)}',  # exact match
                    rf'{re.escape(first_word)}ها {re.escape(rest_of_phrase)}',  # plural with ها
                    rf'{re.escape(first_word)}های {re.escape(rest_of_phrase)}',  # plural with های
                    rf'{re.escape(first_word)}ان {re.escape(rest_of_phrase)}',   # plural with ان
                ]
                
                for pattern in compound_patterns:
                    matches = re.findall(pattern, text)
                    count += len(matches)
            else:
                # For single word keywords, look for the keyword with possible suffixes
                # Persian doesn't work well with \b word boundaries, so we use more specific patterns
                patterns = [
                    rf'(?<!\S){re.escape(keyword_lower)}(?!\S)',  # exact match (not preceded/followed by non-space)
                    rf'(?<!\S){re.escape(keyword_lower)}ها(?!\S)',  # plural with ها
                    rf'(?<!\S){re.escape(keyword_lower)}های(?!\S)',  # plural with های
                    rf'(?<!\S){re.escape(keyword_lower)}هایی(?!\S)',  # plural with هایی
                    rf'(?<!\S){re.escape(keyword_lower)}ان(?!\S)',   # plural with ان
                    rf'(?<!\S){re.escape(keyword_lower)}ی(?!\S)',   # with ی suffix
                ]
                
                # For single word keywords
                for pattern in patterns:
                    matches = re.findall(pattern, text)
                    count += len(matches)
            
            keyword_counts[keyword] = count
        
        return keyword_counts