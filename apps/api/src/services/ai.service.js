import { env } from '../config/env.js';
import { searchTutorials, getTutorialsByCategory, formatTutorialMessage } from './tutorials.service.js';

// Demo responses for common topics - now includes science, technology, education
const demoResponses = {
  // Programming Topics
  python: "Python is a versatile, high-level programming language known for its simplicity and readability. It's widely used in web development, data science, artificial intelligence, and automation. Key features include:\n\n• Easy-to-learn syntax that resembles natural language\n• Extensive libraries and frameworks (Django, Flask, NumPy, Pandas)\n• Cross-platform compatibility\n• Strong community support\n\nYou can start learning Python by installing it from python.org and practicing with interactive tutorials. Great for beginners and professionals alike!",
  
  javascript: "JavaScript is a versatile programming language primarily used for web development. It runs in browsers and servers (Node.js), making it essential for modern web applications. Key aspects:\n\n• Event-driven, functional, and object-oriented capabilities\n• DOM manipulation for interactive web interfaces\n• Asynchronous programming with Promises and async/await\n• Extensive ecosystem (React, Vue, Angular for frontends)\n\nJavaScript powers interactive features on virtually every modern website. Start with basics like variables, functions, and DOM manipulation.",
  
  react: "React is a JavaScript library for building user interfaces with reusable components. Developed by Facebook, it uses a virtual DOM for efficient rendering. Key concepts:\n\n• Component-based architecture (functional and class components)\n• JSX syntax for writing UI declaratively\n• State management and hooks (useState, useEffect, useContext)\n• Unidirectional data flow (props)\n• Large ecosystem (Redux, React Router, Next.js)\n\nReact is perfect for building dynamic, interactive web applications. Start by learning components, props, and hooks.",
  
  sql: "SQL (Structured Query Language) is used for managing and querying relational databases. It's essential for data management and analytics. Core concepts:\n\n• SELECT queries for retrieving data\n• INSERT, UPDATE, DELETE for data manipulation\n• Joins for combining data from multiple tables\n• WHERE, GROUP BY, ORDER BY for filtering and organizing\n• Indexes and optimization for performance\n\nSQL is fundamental for backend development, data analysis, and database administration. Master CRUD operations first, then advance to complex queries.",
  
  learn: "Here are effective ways to learn programming:\n\n1. **Start with fundamentals**: Variables, functions, loops, conditionals\n2. **Practice consistently**: Code every day, even if just for 30 minutes\n3. **Build projects**: Apply what you learn to real problems\n4. **Read documentation**: Understand libraries and frameworks\n5. **Join communities**: Connect with other learners for support\n6. **Debug actively**: Learn to use debuggers and understand errors\n7. **Code review**: Study others' code to learn best practices\n\nChoose a language that interests you and commit to regular practice. Progress comes through consistent effort!",
  
  brainstorm: "Great! Here are some project ideas to build your skills:\n\n**Beginner Projects:**\n• Personal portfolio website\n• To-do list application\n• Weather app using APIs\n• Calculator with UI\n\n**Intermediate Projects:**\n• Blog platform with authentication\n• Real-time chat application\n• E-commerce product catalog\n• Expense tracker with analytics\n\n**Advanced Projects:**\n• Machine learning image classifier\n• Real-time collaboration tool\n• Mobile app with backend\n• AI-powered recommendation system\n\nChoose a project that interests you, break it into smaller tasks, and build incrementally. Projects are the best way to learn!",
  
  debug: "Here's a systematic approach to debugging code:\n\n1. **Understand the error**: Read error messages carefully - they often point to the exact issue\n2. **Isolate the problem**: Use logging/breakpoints to narrow down where things break\n3. **Check assumptions**: Verify that variables have expected values\n4. **Use debuggers**: Learn your language's debugging tools\n5. **Test incrementally**: Make small changes and test each one\n6. **Search for solutions**: Check Stack Overflow for similar issues\n7. **Rubber duck debugging**: Explain your code out loud to catch logical errors\n\nCommon issues: null/undefined values, wrong data types, logic errors, off-by-one errors. Practice debugging and you'll get faster!",
  
  // Science Topics
  physics: "Physics is the fundamental science studying matter, energy, and forces. Key areas:\n\n• **Mechanics**: Motion, forces, Newton's laws\n• **Thermodynamics**: Heat, energy, entropy\n• **Electromagnetism**: Electricity, magnetism, light\n• **Modern Physics**: Relativity, quantum mechanics, atomic physics\n• **Waves and Oscillations**: Sound, light, electromagnetic waves\n\nPhysics explains how the universe works from subatomic to cosmic scales. Start with classical mechanics before moving to advanced topics like quantum physics.",
  
  chemistry: "Chemistry is the science of matter and reactions. Core branches:\n\n• **Organic Chemistry**: Compounds containing carbon (99% of known compounds)\n• **Inorganic Chemistry**: Metal and non-metal compounds\n• **Biochemistry**: Chemistry of living organisms\n• **Physical Chemistry**: Properties and interactions of molecules\n• **Analytical Chemistry**: Methods for analyzing substances\n\nChemistry connects physics and biology. Understanding chemical bonds and reactions is crucial for materials science, medicine, and environmental science.",
  
  biology: "Biology is the study of living organisms and life processes. Major disciplines:\n\n• **Cell Biology**: Structure and function of cells\n• **Genetics**: Heredity, DNA, evolution\n• **Ecology**: Organisms and their environments\n• **Physiology**: Functions of living systems\n• **Molecular Biology**: Life at the molecular level\n\nBiology ranges from microscopic (cells, molecules) to macroscopic (ecosystems, evolution). Understanding cell biology and genetics is foundational.",
  
  quantum: "Quantum mechanics describes the behavior of matter and energy at atomic and subatomic scales. Key principles:\n\n• **Superposition**: Particles exist in multiple states simultaneously\n• **Entanglement**: Particles can be correlated across distances\n• **Wave-particle duality**: Matter exhibits both wave and particle properties\n• **Uncertainty principle**: Cannot simultaneously know position and momentum precisely\n• **Probability**: Outcomes are probabilistic rather than deterministic\n\nQuantum mechanics revolutionized physics and enables modern technology like computers, lasers, and semiconductors.",
  
  // Technology & Education Topics
  study: "Effective study techniques to maximize learning:\n\n1. **Active Recall**: Test yourself frequently instead of passive rereading\n2. **Spaced Repetition**: Review material at increasing intervals\n3. **Interleaving**: Mix different topics in study sessions\n4. **Feynman Technique**: Explain concepts in simple terms\n5. **Practice Problems**: Apply knowledge to real problems\n6. **Teach Others**: Explaining to someone else deepens understanding\n7. **Minimize Distractions**: Use focused study environments\n8. **Sleep**: Essential for memory consolidation\n\nCombine multiple techniques for best results. Consistency matters more than duration!",
  
  memory: "Memory techniques for better retention:\n\n• **Mnemonics**: Create memorable associations (ROY G. BIV for colors)\n• **Method of Loci**: Associate information with physical locations\n• **Spaced Repetition**: Review at increasing intervals (SRS apps)\n• **Chunking**: Group related items (phone number memorization)\n• **Elaboration**: Connect new info to existing knowledge\n• **Visualization**: Create vivid mental images\n• **Active Recall**: Force yourself to retrieve information\n\nThe brain remembers what it retrieves under effort, not passive reading. Practice these techniques for dramatic improvement!",
  
  critical: "Critical thinking skills for analysis and problem-solving:\n\n1. **Question assumptions**: Don't accept things at face value\n2. **Analyze evidence**: Evaluate sources and credibility\n3. **Identify bias**: Recognize personal and media bias\n4. **Consider multiple perspectives**: View problems from different angles\n5. **Logical reasoning**: Follow valid argument structures\n6. **Problem decomposition**: Break complex problems into parts\n7. **Ask clarifying questions**: Ensure you understand before concluding\n\nCritical thinking is essential in academics, careers, and decision-making. Practice actively evaluating information daily!",
  
  data: "Data Science combines statistics, programming, and domain knowledge. Key areas:\n\n• **Data Collection & Cleaning**: 80% of data science work\n• **Exploratory Analysis**: Understanding data patterns\n• **Statistics**: Hypothesis testing and inference\n• **Machine Learning**: Pattern recognition and prediction\n• **Visualization**: Communicating insights effectively\n• **Tools**: Python (Pandas, NumPy), SQL, visualization libraries\n\nData science drives decision-making across industries. Start with Python and statistics, then learn machine learning algorithms.",
  
  cybersecurity: "Cybersecurity protects systems and data from digital attacks. Core domains:\n\n• **Network Security**: Firewalls, intrusion detection\n• **Cryptography**: Encryption and secure communication\n• **Application Security**: Secure software development\n• **Access Control**: Authentication and authorization\n• **Incident Response**: Handling security breaches\n• **Compliance**: Standards like GDPR, ISO 27001\n\nCybersecurity is critical in the digital age. Key skills: penetration testing, security auditing, risk assessment.",
  
  aws: "AWS (Amazon Web Services) is the leading cloud platform. Core services:\n\n• **Computing**: EC2 (virtual servers), Lambda (serverless)\n• **Storage**: S3 (object storage), RDS (databases)\n• **Networking**: VPC, CloudFront, Route 53\n• **Databases**: DynamoDB, RDS, Redshift\n• **Machine Learning**: SageMaker, Rekognition\n• **DevOps**: CloudFormation, CodePipeline\n\nAWS powers millions of applications worldwide. Learn core services like EC2 and S3 first, then advance to serverless and AI/ML.",
  
  ethicsai: "AI Ethics addresses responsible AI development and deployment. Key topics:\n\n• **Bias & Fairness**: Ensuring AI doesn't discriminate\n• **Transparency**: Explaining AI decisions\n• **Accountability**: Who's responsible for AI actions\n• **Privacy**: Protecting personal data in AI systems\n• **Safety**: Ensuring AI systems are secure\n• **Human-AI Collaboration**: Keeping humans in control\n\nAs AI grows more powerful, ethics becomes increasingly important. Developers must consider societal impact of their systems.",
  
  default: "I'm AI Mentor, your learning companion! I'm here to help with:\n\n• Programming concepts and languages (Python, JavaScript, React, SQL, etc.)\n• Science topics (Physics, Chemistry, Biology, Quantum Physics)\n• Technology (AI/ML, Cybersecurity, Cloud Computing, Data Science)\n• Education (Study techniques, Memory, Critical thinking)\n• Project ideas and debugging troubleshooting\n\nWhat would you like help with today? Ask me anything about learning to code or these topics!"
};

// Keywords for different topics
const topicKeywords = {
  python: ['python', 'py'],
  javascript: ['javascript', 'js', 'typescript', 'ts'],
  react: ['react', 'jsx', 'nextjs', 'next.js', 'nextjs'],
  sql: ['sql', 'database', 'query', 'mysql', 'postgresql'],
  learn: ['learn', 'how to start', 'beginner', 'getting started'],
  brainstorm: ['brainstorm', 'project idea', 'project ideas', 'what should i build'],
  debug: ['debug', 'error', 'fix', 'bug', 'what\s wrong', 'not working'],
  physics: ['physics', 'mechanics', 'quantum', 'relativity', 'waves'],
  chemistry: ['chemistry', 'chemical', 'reaction', 'organic', 'compounds'],
  biology: ['biology', 'cellular', 'genetics', 'dna', 'evolution', 'organism'],
  quantum: ['quantum', 'superposition', 'entanglement', 'wave function'],
  study: ['study', 'remember', 'memorize', 'retention', 'learning method', 'how to study'],
  memory: ['memory', 'memorization', 'mnemonic', 'recall'],
  critical: ['critical thinking', 'analysis', 'problem solving', 'logical thinking'],
  data: ['data science', 'machine learning', 'ml', 'ai', 'artificial intelligence', 'data analysis'],
  cybersecurity: ['cybersecurity', 'security', 'hacking', 'encryption', 'network security'],
  aws: ['aws', 'cloud', 'amazon web services', 'ec2', 'lambda', 's3'],
  ethicsai: ['ai ethics', 'ethics', 'bias', 'fairness', 'responsible ai', 'ai safety'],
};

// Keywords that indicate the user wants to see tutorials
const tutorialKeywords = ['tutorial', 'video', 'guide', 'course', 'lesson', 'show me', 'teach me', 'how do i', 'how do you', 'where can i learn'];

function findRelevantResponse(messages) {
  if (!messages || messages.length === 0) {
    return demoResponses.default;
  }
  
  const lastMessage = messages[messages.length - 1]?.content || '';
  const lowerMessage = lastMessage.toLowerCase();
  
  // Try to match keywords in order of specificity
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return demoResponses[topic] || demoResponses.default;
      }
    }
  }
  
  return demoResponses.default;
}

/**
 * Check if the user is asking for tutorials
 */
function isTutorialRequest(messages) {
  if (!messages || messages.length === 0) return false;
  
  const lastMessage = messages[messages.length - 1]?.content || '';
  const lowerMessage = lastMessage.toLowerCase();
  
  return tutorialKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Extract the query topic from user message
 */
function extractQueryTopic(messages) {
  if (!messages || messages.length === 0) return '';
  
  const lastMessage = messages[messages.length - 1]?.content || '';
  return lastMessage;
}

export async function generateChatCompletion({ messages }) {
  // Check if a valid API key is configured
  const hasValidApiKey = env.openrouterApiKey && 
                         env.openrouterApiKey !== 'sk-or-v1-example-api-key-here' &&
                         env.openrouterApiKey.startsWith('sk-or-v1-');

  // Build the response with demo/API text
  let textResponse = '';
  let tutorials = [];

  // First, get the text response
  if (!hasValidApiKey) {
    // Use demo responses instead
    console.log('Using demo AI responses (no valid OpenRouter API key configured)');
    textResponse = findRelevantResponse(messages);
  } else {
    // Try to use OpenRouter API
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.openrouterApiKey}`,
          'HTTP-Referer': env.apiUrl,
          'X-Title': 'AI Mentor'
        },
        body: JSON.stringify({
          model: env.openrouterModel,
          messages: messages || [],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        let errorMessage = `OpenRouter API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          const text = await response.text();
          console.error('OpenRouter API response:', text);
        }
        
        console.warn('OpenRouter API failed, falling back to demo:', errorMessage);
        textResponse = findRelevantResponse(messages);
      } else {
        const data = await response.json();
        textResponse = data.choices?.[0]?.message?.content || findRelevantResponse(messages);
      }
    } catch (err) {
      console.error('Chat completion error:', err);
      textResponse = findRelevantResponse(messages);
    }
  }

  // Second, check if tutorials should be included
  const askingForTutorials = isTutorialRequest(messages);
  if (askingForTutorials) {
    try {
      const queryTopic = extractQueryTopic(messages);
      const searchResults = await searchTutorials(queryTopic);
      if (searchResults && searchResults.length > 0) {
        tutorials = searchResults.slice(0, 3); // Limit to top 3
      }
    } catch (err) {
      console.error('Tutorial search error:', err);
      // Continue without tutorials if search fails
    }
  }

  // Combine text response with tutorials if found
  let finalContent = textResponse;
  if (tutorials.length > 0) {
    const tutorialMessage = formatTutorialMessage(tutorials);
    if (tutorialMessage) {
      finalContent += tutorialMessage;
    }
  }

  return {
    role: 'assistant',
    content: finalContent
  };
}
