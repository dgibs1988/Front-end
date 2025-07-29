import React, { useState } from 'react';

interface OllamaResponse {
  response: string;
  done: boolean;
}

const OllamaInterface: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('localhost');
  const [port, setPort] = useState('11434');
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const models = [
    'llama2', 'llama2:13b', 'llama2:70b',
    'codellama', 'codellama:13b', 'codellama:34b',
    'mistral', 'mixtral', 'neural-chat',
    'starcode', 'vicuna', 'orca-mini'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !prompt.trim()) {
      setError('Please select a model and enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const url = `http://${ipAddress}:${port}/api/generate`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: OllamaResponse = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Ollama server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Ollama Chat Interface
            </h1>
            <p className="text-gray-600">Connect to your Ollama server and chat with AI models</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-2">
                  IP Address
                </label>
                <input
                  id="ip"
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="localhost"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  id="port"
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="11434"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select a model</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                rows={4}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:border-purple-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Send Prompt'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {response && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Response</h3>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {response}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OllamaInterface;