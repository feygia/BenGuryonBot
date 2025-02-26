import { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import ChatMessage from "../ChatMessage/ChatMessage";
import axios from "axios";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [messages, setMessages] = useState([
    // { id: 1, value: "היי, אני פולה, היועצת הדיגיטלית של אוניברסיטת בן גוריון. אני כאן כדי לייעץ לך לגבי מסלול לימודים, תהליכי קבלה ואפשרויות. האם יש לך כיוון לגבי מסלול לימודים?", type: "bot" },
    // { id: 2, type: "options", value: { header: "במה היית רוצה לתרום לעולם?", options: ["תרומה 1", "תרומה 2טקסט ", "תרומה 3טקסט ארך", "תרומה בדיקה בדיקה 4"] } }
    // , {
    //   id: 3, type: "courses", value:
    //   {
    //     courses: [
    //       { name: "ניהול ומדעי המחשב", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם ספרות אנגלית", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מחשבת ישראל", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מחשבת ישראל", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מחשבת ישראל", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מחשבת ישראל", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב וקיימות ושינויי אקלים", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מתמטיקה", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מתמטיקה", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מתמטיקה", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מתמטיקה", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מתמטיקה", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] }
    //     ]
    //   }
    // },
  ]);

   const sendMessageAsync = async (_type,_value,_userid) => {
    try {
        const response = await axios.post(`https://fultgs45z1.execute-api.us-east-1.amazonaws.com/dev/process`, {
          type: _type,
          value: _value,
          userid: _userid
        }, { headers: {'Content-Type': 'application/json'} });

        if (response && response.data) {
            if (response.status === 200) {
              setMessages((prevMessages) => [ ...prevMessages, response.data]);
            }
            if (response.status !=200) {
                throw new Error(`Server failed: ${response.data.status}`);
            }
        }
    } catch (error) {
        console.error('Error post message:', error.message);
        //throw error;
    }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    debugger;
    const reader = new FileReader();
    reader.readAsDataURL(file); // קריאת הקובץ
    reader.onload = () => resolve(reader.result.split(',')[1]); // מחרוזת Base64 (ללא header)
    reader.onerror = (error) => reject(error);
  });
};

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]; // גישה לקובץ הראשון שהועלה
    if (uploadedFile) {
      setUploadFile(uploadedFile);
      const urlFile=URL.createObjectURL(uploadedFile);
      debugger;
      sendMessage("file",{name:uploadedFile.name,url:urlFile})
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
     sendMessageAsync('user','aa','1');
  },[] );

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && input.trim() !== "") {
      sendMessage("user",input.trim());
    }
  };

  const handleOptionClick = (selectedOption) => {
    sendMessage(selectedOption);
  };

  const sendMessage = async (_type,_value) => {
    debugger;
    let msg=null
    if(_type==="file")
    {
      msg={
        id: Date.now(),
        value: _value,
        type: _type,
      };
      setMessages((prevMessages) => [ ...prevMessages, msg]);
      const res = await sendMessageAsync(msg.type,await fileToBase64(uploadFile),'');

    }
    else if(_type==="optionSelected")
    {
      msg={
        id: Date.now(),
        value: _value,
        type: _type,
      };
      setMessages((prevMessages) => [ ...prevMessages, msg]);
      const res = await sendMessageAsync(msg.type,msg.value.key,'');

    }
    else{
      msg={
        id: Date.now(),
        value:input.trim() ,
        type: _type,
      };
      setMessages((prevMessages) => [ ...prevMessages, msg]);
      setInput("");
      const res = await sendMessageAsync(msg.type,msg.value,'');
    }
  };

  return (
    <div className="chat-container">
      {!isOpen ? (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <img className="chat-image" src="../Bot message.png" alt="chat" />
        </button>
      ) : (
        <div className={`chat-box ${isExpanded ? "expanded" : ""}`}>
          <div className="chat-header">
            <button className="close-button" onClick={() => setIsExpanded(!isExpanded)}>
              <img src="/Icons.svg" alt="expand" />
            </button>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              <img src="/minimize.svg" alt="minimize" />
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} value={msg.value} type={msg.type} onOptionClick={handleOptionClick} isFullScreen={isExpanded} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-container">
            <label htmlFor="file-upload" className="file-upload">
              <img src="/attachment.svg" alt="upload file" />
            </label>
            <input id="file-upload" type="file" className="file-input" onChange={handleFileUpload}/>
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="הקלד כאן"
            />
            <button className="send-button" onClick={sendMessage}>
              <img src="/send-icon.svg" alt="send" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
