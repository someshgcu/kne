# INCPUC Digital Experience Platform - Developer Guide

## Project Overview
A comprehensive Digital Experience Platform (DXP) for an educational institution featuring dynamic content management, AI-powered tools, and data-driven performance visualization.

## Design System

### Colors
- **Primary (Midnight Blue)**: #2C1F70 - Navigation, headings, primary buttons
- **Secondary (Lavender)**: #D8D1E9 - Cards, secondary buttons, backgrounds
- **Accent (Golden Glow)**: #EFD22E - CTAs, highlights, badges
- **Success**: #10B981 - Pass rates, positive indicators
- **Error**: #EF4444 - Validation errors
- **Warning**: #EFD22E - Alerts

### Typography
- **Font Family**: Inter (system-ui fallback)
- **Display (H1)**: 36px / 2.25rem - Bold (700)
- **Header (H2)**: 30px / 1.875rem - SemiBold (600)
- **Subhead (H3)**: 24px / 1.5rem - SemiBold (600)
- **Title (H4)**: 20px / 1.25rem - Medium (500)
- **Body**: 16px / 1rem - Regular (400)
- **Small**: 14px / 0.875rem - Regular (400)

### Spacing (8pt Grid)
- xs: 4px
- sm: 8px
- md: 16px (base unit)
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

## Project Structure

```
/src
  /app
    /components
      /home              # Homepage widgets
        - HeroSection.tsx
        - ImpactDashboard.tsx
        - PrincipalMessage.tsx
        - NewsTicker.tsx
        - Gallery.tsx
        - Testimonials.tsx
      /ui                # Reusable UI components (shadcn)
      - Header.tsx
      - Footer.tsx
      - Chatbot.tsx
      - TeacherCard.tsx
    /pages
      - HomePage.tsx
      - AdmissionsPage.tsx
      - FacultyPage.tsx
      - CareersPage.tsx
      - BlogPage.tsx
      /admin
        - AdminLogin.tsx
        - AdminDashboard.tsx
        - LayoutManager.tsx
        - ContentStudio.tsx
        - DataUpload.tsx
  /data
    - mockData.ts        # All mock data and types
  /styles
    - theme.css          # Custom design system
    - fonts.css          # Font imports
```

## Key Features

### Public Features
1. **Impact Engine**: Data visualization with Recharts (pass rates, distinctions)
2. **Cutoff Predictor**: Client-side eligibility calculator
3. **RAG Chatbot**: Context-aware AI assistant
4. **Dynamic Faculty**: Filterable teacher profiles by department
5. **Responsive Design**: Mobile-first approach

### Admin Features
1. **Layout Manager**: Drag-and-drop homepage widget reordering
2. **AI Blog Writer**: Content generation tool (mock AI)
3. **Data Upload**: Excel file processing interface
4. **Authentication**: Simple session-based auth (demo)

## Routes

### Public
- `/` - Home Page
- `/admissions` - Admissions & Cutoff Predictor
- `/faculty` - Faculty Profiles
- `/careers` - Job Listings
- `/news` - News & Blog

### Admin
- `/admin` - Login Page
- `/admin/dashboard` - Dashboard Overview
- `/admin/layout` - Layout Manager
- `/admin/content-studio` - AI Blog Writer
- `/admin/data-upload` - Data Upload

## Demo Credentials
- **Email**: admin@incpuc.edu.in
- **Password**: admin123

## Key Technologies
- **React 18** with TypeScript
- **React Router DOM** for routing
- **Tailwind CSS v4** for styling
- **Recharts** for data visualization
- **React DnD** for drag-and-drop
- **Lucide React** for icons
- **Sonner** for toast notifications

## Accessibility (WCAG AA)
- Semantic HTML throughout
- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast ratios meet AA standards
- Focus indicators visible
- Screen reader friendly

## Mock Data
All data is defined in `/src/data/mockData.ts`:
- Teachers (8 faculty members)
- News Items (5 articles)
- Jobs (4 openings)
- Performance Data (3 years)
- Testimonials (4 students)
- Chatbot Knowledge Base

## Best Practices Implemented
✅ WCAG AA accessibility standards
✅ Reusable component architecture
✅ Semantic HTML elements
✅ Flexbox/Grid layouts (no absolute positioning)
✅ Prop-driven components
✅ Mobile responsive
✅ Clean, maintainable code
✅ TypeScript for type safety

## Future Enhancements
- Real Supabase backend integration
- Actual Gemini AI API integration
- Real-time data updates
- User authentication with roles
- File upload to cloud storage
- Email notifications
- Advanced analytics dashboard
