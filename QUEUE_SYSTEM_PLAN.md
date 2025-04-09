# Queue Management System - Architecture & Implementation Plan

## 1. System Overview

- **Purpose:** Allow students to join a real-time queue to request help from a professor.
- **Access:** Only over a shared Wi-Fi network **without internet**.
- **Interfaces:**
  - **Student Interface:** Enter name, join queue, remove self anytime via "Finished" button.
  - **Main Display:** Real-time, continuously updating queue view for the professor.
- **No authentication**; open to anyone on Wi-Fi.
- **Queue resets** on server restart.

---

## 2. High-Level Architecture

```mermaid
flowchart TD
    subgraph Student Devices
        A1[Student Browser] -- "Join Queue\nRemove Self" --> B(Server)
    end
    subgraph Professor Device
        A2[Professor Browser] -- "View Real-Time Queue" --> B
    end
    B[Local Server (Node.js + Express + Socket.IO)]
    B -- "Serves static pages\nManages queue state\nBroadcasts updates" --> A1
    B -- "Serves static pages\nBroadcasts updates" --> A2
```

---

## 3. Technology Stack

| Component            | Technology                     | Reason                                         |
|----------------------|--------------------------------|------------------------------------------------|
| Backend Server       | **Node.js + Express**          | Lightweight, easy local hosting                |
| Real-time Updates    | **Socket.IO**                  | Handles WebSocket communication seamlessly     |
| Frontend             | **HTML, CSS, Vanilla JS**      | Simple, fast loading, no build tools needed    |
| Hosting Environment  | **Local machine (laptop/PC)**  | Accessible over Wi-Fi without internet         |

---

## 4. Step-by-Step Implementation

### 4.1. Server Setup

- **Initialize project:**
  - `npm init -y`
  - Install dependencies: `npm install express socket.io`
- **Create server:**
  - Serve static HTML/CSS/JS files
  - Maintain an **in-memory queue array** (resets on restart)
  - Handle Socket.IO events:
    - `join_queue` (add student)
    - `remove_self` (remove student)
    - Broadcast updated queue on any change

### 4.2. Network Configuration

- **Bind server to local IP address:**
  - Use `server.listen(port, '0.0.0.0')` to accept connections from LAN
- **Find local IP:**
  - Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  - Example: `192.168.1.42`
- **Access URL:**
  - `http://192.168.1.42:3000` (replace with actual IP and port)
- **Firewall:**
  - Allow inbound connections on the server port (e.g., 3000)
- **Static IP (optional but recommended):**
  - Set static IP on the server device to avoid IP changes disrupting access

### 4.3. Student Interface

- **Fields:**
  - Name input
  - "Join Queue" button
  - "Finished" button (visible only after joining)
- **Behavior:**
  - On join: emit `join_queue` with name
  - On finish: emit `remove_self`
  - Disable join button after joining
  - Re-enable join if removed
- **Feedback:**
  - Show current position in queue
  - Confirmation messages

### 4.4. Main Display Page

- **Features:**
  - Large, clear list of students in order
  - Highlight the **next student** (first in queue)
  - Auto-update in real-time via Socket.IO
- **Design:**
  - High contrast, large fonts
  - Minimal distractions
  - Optionally, full-screen mode (F11)

### 4.5. Real-Time Communication

- **Socket.IO events:**
  - `connect` / `disconnect`
  - `join_queue` (student joins)
  - `remove_self` (student leaves)
  - `queue_update` (server broadcasts updated queue)
- **Concurrency:**
  - Socket.IO handles multiple simultaneous connections efficiently
  - Server updates queue atomically on each event
  - Broadcasts ensure all clients stay in sync

### 4.6. Security Measures

- **LAN-only access:**
  - Server only accessible within Wi-Fi network
- **Obscure URL:**
  - Use non-default port (e.g., 34567) to reduce accidental access
- **Optional:**
  - Simple shared password prompt on student page (not enforced now)
  - IP filtering via firewall rules
- **No sensitive data stored**

---

## 5. Additional Considerations

- **Persistence:** Since queue resets on restart, warn users if server restarts.
- **Scalability:** Suitable for small classroom; for larger scale, consider database persistence.
- **Backup:** Optionally export queue to file before shutdown.
- **Accessibility:** Use clear fonts, colors; test on various devices.
- **Testing:** Simulate multiple clients joining/leaving to ensure stability.

---

## 6. Summary Timeline

| Step                                    | Description                                    |
|-----------------------------------------|------------------------------------------------|
| **1. Initialize Node.js project**       | `npm init -y`, install dependencies            |
| **2. Develop server with Express + Socket.IO** | Serve static files, manage queue, handle events |
| **3. Build student interface**          | HTML form, join/finish buttons, Socket.IO client|
| **4. Build main display page**          | Real-time queue view, highlight next student   |
| **5. Configure network**                | Bind to local IP, firewall, static IP optional |
| **6. Test on multiple devices**         | Connect via Wi-Fi, join/leave queue            |
| **7. Polish UI/UX**                     | Responsive design, accessibility               |
| **8. Document usage**                   | Access URL, instructions for students/professor|