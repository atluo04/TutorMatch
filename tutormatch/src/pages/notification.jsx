import { useEffect, useState } from 'react'
import '../html/notification.css'

function App() {
  const [notifications, setNotifications] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/notifications");  // Fetching data from the server which gets data from db.json in components folder
      const json = await res.json();
      setNotifications(json);
    }
    fetchData();
  }, [])

  function markALLUnread() {
    setNotifications((prev) => prev.map(n => (
      {...n, isUnread: false}
    )))
  }

  function handleNotificationClick(id) {
    setNotifications((prev) => prev.map(n => (
      n.id === id
      ? {...n, isUnread: false} 
      : n
    )))
  }
  return (
    <div className="App">
      <div className="container">
        <header>
          <div className="title">
            <h1>Notifications</h1>
            <span className="badge">{notifications && notifications.filter(n => n.isUnread).length}</span>
          </div>
          <button id="mark" onClick={markALLUnread}>Mark all as read</button>
        </header>
        <div className="wrapper">
          {notifications && notifications.map((n) => (
            <div key={n.id} onClick={() => handleNotificationClick(n.id)} className="notification" data-unread={n.isUnread}>
              <div className="notification-content">
                <img src={n.author.src} alt={n.author.name} className="profile-pic" />
                <div className="post">
                  <div>
                    <div className="post-text">
                      <div>
                        <a href={n.author.href}>
                          {n.author.name}
                          </a>
                          <span> {n.text}</span>
                          {n.link && (
                          <a href={n.link.href} > {n.link.text}</a>
                        )}
                        {n.isUnread && (
                          <span className="isUnread"></span>
                        )}
                      </div> 
                    </div>
                    <p className="time">{n.time}</p>
                  </div>
                  {n.privateMessage && (
                    <p className="privateMessage">{n.privateMessage}</p>
                  )}
                </div>
              </div>
              {n.image && (<a href={n.image.href}>
                <img src={n.image.src} alt={n.image.alt} />
              </a>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
