 class StringUtils:
    @staticmethod
    def uppercase(s: str) -> str:
        return s.upper()
    
    @staticmethod
    def lowercase(s: str) -> str:
        return s.lower()
    
    @staticmethod
    def reverse(s: str) -> str:
        return s[::-1]
    
    @staticmethod
    def truncate(s: str, length: int) -> str:
        if length < 0:
            raise ValueError("length cannot be negative")
        if length == 0:
            return "..."
        if len(s) <= length:
            return s
        return s[:length] + "..."


# Test
if __name__ == "__main__":
    print(StringUtils.uppercase("hello"))      # HELLO
    print(StringUtils.lowercase("WORLD"))      # world
    print(StringUtils.reverse("OpenClaw"))     # walCnepO
    print(StringUtils.truncate("Hello world", 5))  # Hello...
