import { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import ChatMessage from "../ChatMessage/ChatMessage";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const uploadFileRef = useRef(null);
  const [fileUrl, setFileUrl] = useState("");
  const [errors, setErrors] = useState("");
  const [sessionId, setSessionId] = useState(uuidv4())
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    // { id: 1, value: "היי, אני פולה, היועצת הדיגיטלית של אוניברסיטת בן גוריון. אני כאן כדי לייעץ לך לגבי מסלול לימודים, תהליכי קבלה ואפשרויות. האם יש לך כיוון לגבי מסלול לימודים?", type: "bot" },
    // { id: 2, type: "options", value: { header: "במה היית רוצה לתרום לעולם?", options: ["תרומה 1", "תרומה 2טקסט ", "תרומה 3טקסט ארך", "תרומה בדיקה בדיקה 4"] } }
    // , {
    //   id: 3, type: "courses", value:
    //   {
    //     courses: [
    //       { name: "ניהול ומדעי המחשב", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם היסטוריה של עם ישראל", IsOpenReg: false, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] },
    //       { name: "מדעי המחשב עם מתמטיקה", IsOpenReg: true, props: ["חטיבה מורחבת", "תוכנית ראשית", "דו-מחלקתי"] }
    //     ]
    //   }
    // },
  ]);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // sendMessage('error', 'ישנה תקלה זמנית ,אנא נסה שנית מאוחר יותר');
  }, [errors]);

  useEffect(() => {
    try {
      // setSessionId(uuidv4());
      sendMessageAsync('user', 'שלום');
    }
    catch (error) {
      setErrors(error.message);
    }
  }, []);

  const sendMessageAsync = async (_type, _value) => {
    try {
      setLoading(true);
      // const response = await axios.post(`https://fultgs45z1.execute-api.us-east-1.amazonaws.com/dev/process`, {
         const response = await axios.post(`https://pola-dev.bgu.ac.il/chat`, {
          // const response = await axios.post(`https://e1tdhkbxnh.execute-api.us-east-1.amazonaws.com/test/chat`, {----טסטים 
        // const response = await axios.post(`http://147.235.193.111:8000/chat`, {
        //  type: _type,
        message: _type != "file" ? _value : null,
        user_id: sessionId,
        file: _type == "file" ? _value : null
      }, { headers: { 'Content-Type': 'application/json' } });

      if (response && response.data) {
        if (!response.data.error) {
          setLoading(false);
          if (response.status === 200) {
            // response.data.id = Date.now();
            sendMessage("bot", response.data.output)
            // setMessages((prevMessages) => [...prevMessages, response.data.output]);
          }
          if (response.status != 200) {
            throw new Error(`Server failed: ${response.data.status}`);
          }
        }
        else{
        throw new Error("server return error: "+response.data.error);

        }
      }
      else{
        throw new Error("no date return from server");
      }
    } catch (error) {
      setLoading(false);
      console.error('Error post message:', error.message);
    }
  };

  const sendMessage = async (_type = null, _value = null) => {
    try {
      let msg = null
      if (_type === "file") {
        msg = {
          id: Date.now(),
          value: _value,
          type: _type,
        };
        setMessages((prevMessages) => [...prevMessages, msg]);
        const res = await sendMessageAsync(msg.type, await fileToBase64(uploadFileRef.current));

      }
      else if (_type === "optionSelected") {
        msg = {
          id: Date.now(),
          value: _value,
          type: _type,
        };
        setMessages((prevMessages) => [...prevMessages, msg]);
        const res = await sendMessageAsync(msg.type, msg.value.key + "," + msg.value.value);

      }
      else if (_type === "error") {
        msg = {
          id: Date.now(),
          value: _value,
          type: _type,
        };
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
      else if (_type === "bot") {
        msg = {
          id: Date.now(),
          value: _value,
          type: _type,
        };
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
      else {
        msg = {
          id: Date.now(),
          value: input.trim(),
          type: "user",
        };
        setMessages((prevMessages) => [...prevMessages, msg]);
        setInput("");
        await sendMessageAsync(msg.type, msg.value);
      }
    }
    catch (error) {
      setErrors(error.message);
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
    try {
      const uploadedFile = event.target.files[0]; // גישה לקובץ הראשון שהועלה
      if (uploadedFile) {
        uploadFileRef.current = uploadedFile; // עדכון מיידי!
        const urlFile = URL.createObjectURL(uploadedFile);
        sendMessage("file", { name: uploadedFile.name, url: urlFile })
        event.target.value = null;
      }
    }
    catch (error) {
      setErrors(error.message);
    }
  };

  const handleKeyDown = (event) => {
    try {
      if (event.key === "Enter" && !event.shiftKey && input.trim() !== "") {
        sendMessage("user", input.trim());
      }
    }
    catch (error) {
      setErrors(error.message);
    }
  };

  const handleOptionClick = (option) => {
    sendMessage("optionSelected", option);
  };



  return (
    <div className="chat-container">
      {!isOpen ? (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <img className="chat-image" src="../Pola.png" alt="chat" />
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
          <div>
            {loading && (
              <div className="loading-container">
                <div className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <span className="typing-text">פולה מקלידה</span>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <label htmlFor="file-upload" className="file-upload">
              <img src="/attachment.svg" alt="upload file" />
            </label>
            <input id="file-upload" type="file" className="file-input" onChange={handleFileUpload} />
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
