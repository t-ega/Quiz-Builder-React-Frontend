# Quiz Builder Frontend - README

Welcome to the Quiz Builder Frontend! This application allows users to create, manage, and take quizzes with ease. The frontend is built using React and Pure CSS, with Redux for state management in the admin panel, Context API for client-side state management, Zod for validation, Axios for API requests, and Toast for notifications.

## Features

### User Interface

- **Responsive Design**: Built with pure CSS to ensure the application is responsive and user-friendly across different devices.
- **Intuitive Navigation**: Easy navigation for creating, managing, and taking quizzes.

### State Management

- **Redux**: Powers the state management for the admin panel, ensuring efficient handling of complex state changes.
- **Context API**: Used for managing state on the client side, providing a lightweight solution for passing data through the component tree.

### Validation

- **Zod**: Ensures data validation for forms and user inputs, improving reliability and user experience.

### API Interaction

- **Axios**: Handles communication with the backend, making it easy to perform CRUD operations and handle API responses.

### Notifications

- **Toast**: Provides real-time notifications for user actions such as quiz creation, submission, and errors.

## Installation and Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Steps to Set Up

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/t-ega/quiz-builder-frontend.git
   cd quiz-builder-frontend
   ```

2. **Install Dependencies**:

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**:

   - Create a `.env` file in the root directory and add your API URL:
     ```sh
     VITE_BACKEND_URL=http://localhost:3000/api/v1
     ```

4. **Start the Development Server**:
   ```sh
   npm run dev
   # or
   yarn start
   ```

### Project Structure

- **src/components**: Contains reusable UI components.
- **src/pages**: Contains page components for different views (e.g., Home, Quiz, Admin).
- **src/context**: Contains Context API setup for client-side state management.
- **src/validation**: Contains Zod schemas for data validation.
- **src/api**: Contains Axios setup and API service functions.

## Usage

### User Registration and Sign In

1. **Register**: Navigate to the registration page and fill in the required details.
2. **Sign In**: Use your credentials to sign in and gain access to quiz creation and management features.

### Creating and Managing Quizzes

1. **Create Quiz**: Navigate to the quiz creation page, enter the quiz title, add questions and options, and set the quiz time.
2. **Save as Draft**: Save the quiz in draft mode for further editing.
3. **Publish Quiz**: Publish the quiz to generate a unique link for distribution.
4. **Notifications**: Receive real-time notifications for successful actions or errors.

### Taking the Quiz

1. **Access Quiz**: Use the unique link sent to your email to access the quiz.
2. **Submit Answers**: Complete the quiz and submit your answers for evaluation.
3. **Single Attempt**: Ensure you complete the quiz in one attempt as multiple attempts are not allowed.

### Admin Monitoring

1. **Admin Dashboard**: Access the admin panel to view all quizzes and track quiz completions.
2. **View Participants**: See the list of participants who have taken the quiz, including their email and completion time.
3. **Notifications**: Get notified when a participant completes a quiz.

## Conclusion

The Quiz Builder Frontend offers a seamless and user-friendly interface for creating, managing, and taking quizzes. With a robust state management system, reliable data validation, and efficient API interactions, it ensures a smooth experience for both quiz creators and participants.
