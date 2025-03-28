# Log Classification System ✨

Automatically classify system logs with ML and pattern matching 🚀

## Repository Topics

- 🤖 machine-learning
- 📊 log-analysis
- 🛠️ fastapi
- ⚛️ react
- 🔍 pattern-matching
- 🧠 nlp
- 🔄 batch-processing

## 🚀 Features
- **Automatic Classification**: Categorize logs as "Error", "Warning", "System Notification", "User Action", etc.
- **Batch Processing**: Upload CSV files with multiple logs for bulk classification
- **Single Log Analysis**: Classify individual log messages in real-time
- **Responsive UI**: Modern React frontend that works across all devices
- **RESTful API**: Well-documented API for integration with existing systems

## 💻 Technologies
- **Backend**: Python, FastAPI, Uvicorn
- **Frontend**: React, Bootstrap, Axios
- **Classification**:
  - Regex pattern matching
  - Machine learning (scikit-learn)
  - Sentence transformers for embeddings
- **Data Processing**: Pandas, NumPy

## 📋 Installation

### 🐍 Backend Setup
```bash
# Clone repository
git clone https://github.com/yasirukularathne/Log_Classification.git
cd Log_Classification

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run locally
cd Server
python Server.py
```

### ⚛️ Frontend Setup

```bash
# Navigate to frontend directory
cd log-classification-frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🔍 Usage Examples

### Classifying a Batch of Logs
1. Prepare a CSV file with source and log_message columns:
   ```
   source,log_message
   LegacyCRM,User User123 logged in.
   WebApp,Backup completed successfully.
   Database,System updated to version 2.1.0
   ```
2. Upload through the Batch Classification page
3. Download the classified CSV with added target_label column

### Single Log Classification

Enter the source system and log message to get immediate classification results:

- Source: Database
- Log Message: "System reboot initiated by user admin"
- Result: System Notification

## 🔧 Configuration

The system can be configured through environment variables:

```
# API Configuration
PORT=8000
HOST=0.0.0.0
```

## 📊 Classification Methods

The system uses several techniques to classify logs:

- **Regex Patterns**: For structured logs with recognizable patterns
- **Keyword Analysis**: Identifies important terms within log messages
- **NLP Embeddings**: Uses sentence transformers for semantic understanding

Example regex pattern:
- `r"User User\d+ logged (in|out)."` -> "User Action"
- `r"Backup (started|ended|completed) at .*"` -> "System Notification"

## 🧪 Testing
```bash
# Run tests
pytest

# Generate coverage report
pytest --cov=processor tests/
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👏 Acknowledgments
- [FastAPI](https://fastapi.tiangolo.com/) - The API framework used
- [React](https://reactjs.org/) - Frontend library
- [scikit-learn](https://scikit-learn.org/) - Machine learning tools
- [sentence-transformers](https://www.sbert.net/) - NLP embeddings

Made with ❤️ by Yasiru Kularathne
