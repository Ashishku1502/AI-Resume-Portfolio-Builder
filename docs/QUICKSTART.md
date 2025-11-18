# Quick Start Guide - AI Resume & Portfolio Builder

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Application
```bash
npm run dev -- --host 127.0.0.1
```

Or if that fails:
```bash
npx vite --host 127.0.0.1
```

### Step 3: Open in Browser
Navigate to the URL shown in your terminal (typically `http://127.0.0.1:5173`)

## 📝 First-Time Usage

### Create Your First Resume

1. **Fill in Your Profile** (Left Panel)
   - Enter your name: "John Doe"
   - Current title: "Software Engineer"
   - Email: "john@example.com"
   - Location: "San Francisco, CA"
   - Add your work experience, projects, and skills

2. **Generate Content** (Right Panel)
   - Target role: "Senior Software Engineer"
   - Select tone: "Professional"
   - Click "Generate Resume"

3. **Download**
   - Review the generated content
   - Click "Download Resume (TXT)"

### Try the Interview Coach

1. **Switch to Interview Coach Tab**
   - Click "Interview Coach" at the top

2. **Select a Question**
   - Choose "Behavioral" or "Technical Design"
   - Pick a question from the dropdown

3. **Answer and Get Feedback**
   - Type your answer
   - Click "Evaluate Answer"
   - Review your score and feedback

## 🎯 Key Features to Try

### Resume Builder
- ✅ Upload existing resume (TXT/DOCX)
- ✅ Generate ATS-friendly content
- ✅ Try different tones (Professional, Confident, Friendly)
- ✅ Download as text file

### Cover Letter Generator
- ✅ Paste job description
- ✅ Get tailored cover letter
- ✅ See key achievements highlighted

### LinkedIn Optimizer
- ✅ Generate optimized headline
- ✅ Create engaging About section
- ✅ Check character count

### Interview Coach
- ✅ Practice behavioral questions
- ✅ Review technical design questions
- ✅ Get scored feedback (0-10)
- ✅ See improved answer examples

## 💡 Pro Tips

### For Best Results

**Resume Generation**:
- Be specific in your work experience
- Include quantifiable achievements
- List relevant technical skills
- Mention specific projects with impact

**Cover Letter**:
- Paste the complete job description
- Include company name if available
- Specify the exact role title

**Interview Practice**:
- Use STAR format for behavioral questions
  - Situation: Set the context
  - Task: Describe your responsibility
  - Action: Explain what you did
  - Result: Share the outcome
- For technical questions, cover:
  - Requirements gathering
  - System architecture
  - Scalability considerations
  - Trade-offs

## 🔧 Troubleshooting

### Application Won't Start
```bash
# Try clearing cache
rm -rf node_modules
npm install
npm run dev -- --host 127.0.0.1
```

### File Upload Not Working
- Ensure file is TXT or DOCX format
- Check file size (should be reasonable)
- Try manual input instead

### AI Generation Slow
- First request may take up to 30 seconds
- Be patient, the AI is processing
- Check your internet connection

### Download Not Working
- Check browser download settings
- Allow downloads from localhost
- Try a different browser

## 📱 Browser Compatibility

**Recommended**: Chrome, Firefox, Safari, Edge (latest versions)

**Minimum Requirements**:
- JavaScript enabled
- Cookies enabled
- Modern browser (2020+)

## 🎨 Customization

### Change Color Scheme
Edit `src/index.css` to modify the design system:
```css
:root {
  --primary: 210 79% 56%; /* Professional Blue */
  /* Modify other colors as needed */
}
```

### Add More Interview Questions
Edit `src/data/interviewQuestions.ts`:
```typescript
export const behavioralQuestions: InterviewQuestion[] = [
  {
    id: 'b9',
    question: 'Your custom question here',
    type: 'behavioral',
  },
  // Add more questions
];
```

## 📚 Next Steps

1. **Explore All Features**: Try each tab and feature
2. **Generate Multiple Versions**: Experiment with different tones
3. **Practice Interviews**: Use the coach regularly
4. **Customize Content**: Edit generated content to match your style
5. **Share Feedback**: Report issues or suggest improvements

## 🆘 Need Help?

- Check the main [README.md](../README.md) for detailed documentation
- Review [FEATURES.md](./FEATURES.md) for feature details
- See [prd.md](./prd.md) for requirements

## 🎉 You're Ready!

Start building your professional resume and ace those interviews!

---

**Happy Job Hunting! 🚀**
