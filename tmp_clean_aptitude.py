import re

with open("d:\\python play ground\\Python-playground-pro\\src\\pages\\AptitudePage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the array with an import statement
start_str = "const aptitudeTypes = ["
end_str = "type AptitudeType = (typeof aptitudeTypes)[number];"

if start_str in content and end_str in content:
    start_idx = content.index(start_str)
    # find the end of the array which is '];\n\n' just before end_str
    # Let's just use slicing: from start_idx to the index of end_str
    end_idx = content.index(end_str)
    
    new_content = content[:start_idx] + "import { aptitudeTypes } from \"@/data/aptitudeQuestions\";\n\n" + content[end_idx:]
    
    # Also update the 16 to 100
    new_content = new_content.replace('value: "16"', 'value: "100"')
    
    with open("d:\\python play ground\\Python-playground-pro\\src\\pages\\AptitudePage.tsx", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Success")
else:
    print("Failed to find start or end strings")
