# Agri AI API Documentation

## Authentication

### Register
POST /api/auth/register

### Login
POST /api/auth/login

---

## Crop Detection

### Detect Disease
POST /api/detect

Body:
- image

Returns:
- crop
- status
- confidence
- severity
- advice

---

## History

### User Prediction History
GET /api/detect/history

---

## Chatbot

POST /api/chat

Body:
{
  "message":"How to prevent fungus?"
}

---

## Dashboard

GET /api/dashboard/stats