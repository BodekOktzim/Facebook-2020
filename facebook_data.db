import sqlite3
from flask import Flask, request, jsonify

app = Flask(__name__)

# פונקציה לנירמול מספר טלפון לפורמט בינלאומי (ישראל)
def normalize_phone(phone):
    # הסרת תווים שאינם מספרים
    clean_phone = ''.join(filter(str.isdigit, phone))
    
    # אם מתחיל ב-0, נחליף ב-972
    if clean_phone.startswith('0'):
        clean_phone = '972' + clean_phone[1:]
    # אם זה מספר מקומי בלי 0 ובלי 972 (למשל 52...), נוסיף 972
    elif len(clean_phone) == 9:
        clean_phone = '972' + clean_phone
        
    return clean_phone

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "אנא הזן מספר טלפון או מזהה"}), 400

    normalized_q = normalize_phone(query)
    
    try:
        # חיבור למאגר הנתונים (הקובץ חייב להיות באותה תיקייה)
        conn = sqlite3.connect('facebook_data.db')
        cursor = conn.cursor()
        
        # שאילתה לחיפוש לפי טלפון או ID (בהתאם למבנה במסמך)
        # שים לב: שמות העמודות צריכים להתאים למאגר שלך
        cursor.execute("SELECT * FROM users WHERE phone = ? OR fb_id = ?", (normalized_q, query))
        result = cursor.fetchone()
        
        conn.close()
        
        if result:
            # החזרת הנתונים בצורה מסודרת (דוגמה למבנה)
            return jsonify({
                "found": True,
                "data": {
                    "name": result[1],
                    "city": result[2],
                    "work": result[3],
                    "phone": result[0]
                }
            })
        else:
            return jsonify({"found": False, "message": "לא נמצאו נתונים"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
