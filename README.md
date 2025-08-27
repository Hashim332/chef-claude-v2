# Chef Claude 🍳

Chef Claude is an AI-powered recipe generator that creates personalized recipes from user inputs. Users can either upload images of their fridge/ingredients or manually enter ingredients to get AI-generated recipes powered by Anthropic's Claude API.

## 🏗️ Application Architecture Overview

### **Frontend (React + TypeScript + Vite)**

#### **Input Methods & Validation**

- **Dual Input System**: Tabbed interface allowing users to choose between:
  - **Image Upload**: Users can photograph their fridge/ingredients
  - **Text Input**: Manual ingredient entry with real-time validation
- **Input Validation**:
  - Regex filtering removes special characters from ingredient names
  - Duplicate detection prevents adding same ingredients
  - Format standardization (capitalize first letter, lowercase rest)
  - File type validation (images only, 15MB limit)
  - Real-time error messages with auto-dismiss

#### **User Authentication**

- **Clerk Integration**: Complete auth solution with sign-in/sign-up flows
- **Protected Routes**: Recipe saving/viewing requires authentication
- **User Context**: Authentication state managed globally
- **Middleware Protection**: Backend routes secured with Clerk middleware

#### **State Management (React Context)**

- **Centralized State**: Single `AppContext` manages all application state
- **State Structure**:
  - `ingredients[]`: Array of user-entered ingredients
  - `recipe`: Current generated recipe object
  - `savedRecipes[]`: User's saved recipes collection
  - `file` & `preview`: Image upload handling
- **State Actions**: Reset functions, setters with proper TypeScript typing
- **Context Pattern**: Custom hook `useRecipeContext()` for component access

### **Backend (Node.js + Express + TypeScript)**

#### **REST API Endpoints**

- **Public Routes**:
  - `POST /api/generate/by-ingredients`: Generate recipe from ingredient list
  - `POST /api/generate/by-image`: Generate recipe from uploaded image
- **Protected Routes** (Clerk middleware):
  - `POST /api/save-recipe`: Save recipe to user's collection
  - `GET /api/user-recipes`: Retrieve user's saved recipes
  - `DELETE /api/user-recipes/:id`: Delete saved recipe

#### **Database (Firebase Firestore)**

- **NoSQL Document Storage**: User recipes stored as documents
- **Collection Structure**: `/recipes/{recipeId}` with user ID references
- **Recipe Schema**:
  ```typescript
  {
    recipeName: string,
    quickSummary: string,
    fullRecipe: string,
    userId: string,
    createdAt: timestamp
  }
  ```

#### **Image Processing Pipeline**

- **Multi-stage Processing**:
  1. **Format Conversion**: Ensure JPEG format using Sharp
  2. **Size Optimization**: Resize to max 1200px while maintaining aspect ratio
  3. **Compression**: Binary search algorithm finds optimal quality (10-90%)
  4. **Base64 Encoding**: Convert for API transmission
- **Error Handling**: Custom `ImageProcessingError` class with specific error codes
- **File Validation**: Multer middleware with size limits and type checking

#### **AI Integration (Anthropic Claude)**

- **Structured Prompts**: Detailed system prompt enforcing JSON output format
- **Model**: Claude-3-Haiku for fast, cost-effective generation
- **Output Forcing**: System prompt ensures parseable JSON responses
- **Response Structure**:
  ```json
  {
    "recipeName": "string",
    "quickSummary": "string",
    "fullRecipe": "markdown-formatted string"
  }
  ```
- **Dual Input Handling**:
  - Text mode: Ingredients array → recipe
  - Image mode: Base64 image + prompt → recipe

## 🚀 Key Technical Features

### **Type Safety**

- Full TypeScript implementation across frontend and backend
- Shared type definitions for API contracts
- Strict type checking with proper error handling

### **Error Handling**

- Comprehensive error boundaries and try-catch blocks
- User-friendly error messages with auto-dismiss
- API error response standardization
- Image processing error codes for debugging

### **Performance Optimizations**

- Image compression reduces API payload size
- Context-based state management minimizes re-renders
- Efficient file handling with memory cleanup
- Base64 size limits prevent API timeouts

### **User Experience**

- Real-time validation feedback
- Loading states during AI generation
- Smooth scroll to generated recipes
- Responsive design with mobile-first approach

## 🛠️ Tech Stack Summary

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, TypeScript
- **Authentication**: Clerk
- **Database**: Firebase Firestore
- **AI**: Anthropic Claude API
- **Image Processing**: Sharp, Multer
- **Deployment**: Railway (backend), Frontend hosting
