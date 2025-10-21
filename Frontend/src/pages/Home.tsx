import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, BarChart3, Globe, Upload, Zap, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Database,
      title: 'Comprehensive Analysis',
      description: 'Deep taxonomic classification and biodiversity assessment'
    },
    {
      icon: BarChart3,
      title: 'Advanced Metrics',
      description: 'Shannon Index, Simpson Index, and species richness calculations'
    },
    {
      icon: Globe,
      title: 'Global Distribution',
      description: 'Geographic mapping of species distribution'
    },
    {
      icon: Shield,
      title: 'Quality Control',
      description: 'Automated quality assessment and contamination detection'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BioDiversity Analyzer</span>
            </div>
            <div className="flex space-x-8">
              <button className="text-slate-300 hover:text-white transition-colors font-medium">
                Home
              </button>
              <button 
                onClick={() => navigate('/upload')}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Upload
              </button>
              <button className="text-slate-300 hover:text-white transition-colors font-medium">
                Documentation
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Advanced Biodiversity
              <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Analysis Platform
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Professional-grade FASTA file analysis for comprehensive biodiversity assessment. 
              Get detailed taxonomic distribution, quality metrics, and interactive visualizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/upload')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Upload className="h-5 w-5" />
                <span>Upload FASTA File</span>
              </button>
              <button className="border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-blue-500 to-teal-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">100+</div>
              <div className="text-slate-400">Species Identified</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">99.8%</div>
              <div className="text-slate-400">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">5min</div>
              <div className="text-slate-400">Average Processing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400">Analysis Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Database className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold text-white">BioDiversity Analyzer</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 BioDiversity Analyzer. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
