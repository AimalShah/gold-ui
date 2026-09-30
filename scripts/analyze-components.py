#!/usr/bin/env python3
import os
import re
import glob

def analyze_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
        line_count = len(lines)

    # Check for hooks
    use_states = len(re.findall(r'\buseState\b', content))
    use_effects = len(re.findall(r'\buseEffect\b', content))
    use_memos = len(re.findall(r'\buseMemo\b', content))
    use_callbacks = len(re.findall(r'\buseCallback\b', content))
    use_custom = len(re.findall(r'\buse[A-Z]\w+\b', content)) - use_states - use_effects - use_memos - use_callbacks
    total_hooks = use_states + use_effects + use_memos + use_callbacks + max(0, use_custom)

    # Check for components/JSX returns
    return_jsx = len(re.findall(r'return\s*\(\s*<', content))
    
    return {
        'filepath': filepath,
        'line_count': line_count,
        'use_states': use_states,
        'use_effects': use_effects,
        'total_hooks': total_hooks,
        'return_jsx': return_jsx,
    }

def main():
    files = glob.glob('src/**/*.tsx', recursive=True)
    results = []
    for f in files:
        if '/ui/' in f:
            # shadcn UI primitives are standard Radix UI wrappers
            continue
        data = analyze_file(f)
        if data['line_count'] > 100:
            results.append(data)

    results.sort(key=lambda x: x['line_count'], reverse=True)

    print("=" * 80)
    print("REACT FILES > 100 LINES AUDIT (UI & HOOKS)")
    print("=" * 80)
    print(f"{'File':<45} | {'Lines':<6} | {'Hooks':<6} | {'Status'}")
    print("-" * 80)

    for r in results:
        status = "NEEDS REFACTOR" if r['line_count'] > 150 or r['total_hooks'] > 5 else "MODERATE"
        print(f"{r['filepath']:<45} | {r['line_count']:<6} | {r['total_hooks']:<6} | {status}")

    print("-" * 80)
    print(f"Total candidate files identified: {len(results)}")

if __name__ == '__main__':
    main()
