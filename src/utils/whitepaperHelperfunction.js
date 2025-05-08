export function parseKeyValuePairs(text) {
    const lines = text.split(/\r?\n/);
    const result = {};
  
    for (const line of lines) {
      const trimmedLine = line.trim();
  
      // Check if the line starts with the key-value pattern indicator ' - "'
      // Also handle potential extra space like in " -  \"Sales 1\""
      const match = trimmedLine.match(/^\s*-\s*"([^"]+)":\s*"(.+)"(,?)$/);
  
      if (match) {
        let key = match[1];
        let valuePart = match[2];
  
        // Basic handling for escaped newlines if they appear as "\\n"
        // If newlines are literal \n within the string, they are preserved
        valuePart = valuePart.replace(/\\n/g, '\n');
  
        result[key] = valuePart;
      }
    }
  
    return result;
  }

export function brand_profile (text){
    const json = parseKeyValuePairs(text);
    if(json !== null && typeof json === 'object' && !Array.isArray(json)){
        const client = json["Client"]?` - Client:${json["Client"]}\n`:null
        const category = json["Category"]?` - Category:${json["Category"]}\n`:null
        const brand = json["Brand Positioning / USP"]?` - Brand Positioning:${json["Brand Positioning / USP"]}\n`:null
        const audience = json["Target Audience"]?` - Target Audience:${json["Target Audience"]}\n`:null
        const budget = json["Budget"]?` - Budget:${json["Budget"]}\n`:null
        const objectives = json["Program Objectives / KPIs / Purpose"]?` - Program Objectives / KPIs / Purpose:${json["Program Objectives / KPIs / Purpose"]}`:null

        const brandProfile = `- Brand Profile: \n${client}${category}${brand}${audience}${objectives}`
        return brandProfile        

    }else{return null}
}