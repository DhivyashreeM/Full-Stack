import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RefreshCw, CheckCircle2, AlertCircle, Database, Zap } from 'lucide-react';

const Processing: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('initializing');
  const { fileId, fileName, fileSize } = location.state || {};

  // Generate mock analysis result (move this outside useEffect)
  const generateMockAnalysisResult = () => {
    return {
      fileName: fileName || 'sample_sequences.fasta',
      fileSize: fileSize || 0,
      totalSequences: Math.floor(Math.random() * 5000) + 1000,
      processingTime: Math.floor(Math.random() * 10000) + 5000,
      analysisDate: new Date().toISOString(),
      hierarchicalDistribution: {
        kingdom: [
          { 
            name: 'Animalia', 
            count: 342, 
            percentage: 27.4,
            children: ['Chordata', 'Arthropoda', 'Mollusca'],
            novelOrganisms: 12,
            biodiversityIndex: 0.89
          },
          { 
            name: 'Plantae', 
            count: 287, 
            percentage: 23.0,
            children: ['Tracheophyta', 'Bryophyta', 'Marchantiophyta'],
            novelOrganisms: 8,
            biodiversityIndex: 0.76
          },
          { 
            name: 'Fungi', 
            count: 198, 
            percentage: 15.9,
            children: ['Basidiomycota', 'Ascomycota', 'Zygomycota'],
            novelOrganisms: 15,
            biodiversityIndex: 0.82
          },
          { 
            name: 'Bacteria', 
            count: 156, 
            percentage: 12.5,
            children: ['Proteobacteria', 'Firmicutes', 'Actinobacteria'],
            novelOrganisms: 23,
            biodiversityIndex: 0.94
          },
          { 
            name: 'Protista', 
            count: 134, 
            percentage: 10.7,
            children: ['Sarcomastigophora', 'Ciliophora', 'Apicomplexa'],
            novelOrganisms: 7,
            biodiversityIndex: 0.68
          }
        ],
        phylum: {
          'Animalia': [
            { 
              name: 'Chordata', 
              count: 285, 
              percentage: 22.8,
              children: ['Mammalia', 'Aves', 'Reptilia'],
              novelOrganisms: 5,
              biodiversityIndex: 0.85
            },
            { 
              name: 'Arthropoda', 
              count: 198, 
              percentage: 15.9,
              children: ['Insecta', 'Arachnida', 'Crustacea'],
              novelOrganisms: 8,
              biodiversityIndex: 0.79
            }
          ],
          'Plantae': [
            { 
              name: 'Tracheophyta', 
              count: 245, 
              percentage: 19.6,
              children: ['Magnoliopsida', 'Pinopsida', 'Liliopsida'],
              novelOrganisms: 6,
              biodiversityIndex: 0.81
            }
          ]
        },
        class: {
          'Chordata': [
            { 
              name: 'Mammalia', 
              count: 198, 
              percentage: 15.9,
              children: ['Primates', 'Rodentia', 'Carnivora'],
              novelOrganisms: 3,
              biodiversityIndex: 0.83
            }
          ]
        },
        family: {
          'Mammalia': [
            { 
              name: 'Hominidae', 
              count: 145, 
              percentage: 11.6,
              children: ['Homo', 'Pan', 'Gorilla'],
              novelOrganisms: 1,
              biodiversityIndex: 0.75
            }
          ]
        },
        species: {
          'Hominidae': [
            { 
              name: 'Homo sapiens', 
              count: 134, 
              percentage: 10.7,
              novelOrganisms: 0,
              biodiversityIndex: 0.71
            }
          ]
        }
      },
      biodiversityIndices: {
        shannonIndex: 2.45,
        simpsonIndex: 0.78,
        speciesRichness: 156,
        evenness: 0.67,
        dominance: 0.22
      },
      sequenceStats: {
        totalLength: 12563478,
        averageLength: 10075,
        gcContent: 52.3,
        nContent: 0.8
      },
      qualityMetrics: {
        qualityScore: 98.2,
        contaminationRisk: 1.4,
        completeness: 96.8
      },
      novelOrganisms: {
        total: 45,
        byKingdom: [
          { kingdom: 'Bacteria', count: 23, confidence: 0.92 },
          { kingdom: 'Fungi', count: 15, confidence: 0.88 },
          { kingdom: 'Animalia', count: 12, confidence: 0.85 },
          { kingdom: 'Plantae', count: 8, confidence: 0.82 },
          { kingdom: 'Protista', count: 7, confidence: 0.78 }
        ]
      }
    };
  };

  useEffect(() => {
    if (!fileId) {
      navigate('/upload');
      return;
    }

    // Simulate processing steps
    const steps = [
      { status: 'Uploading file...', duration: 1000 },
      { status: 'Validating FASTA format...', duration: 1500 },
      { status: 'Parsing sequences...', duration: 2000 },
      { status: 'Performing taxonomic classification...', duration: 2500 },
      { status: 'Calculating biodiversity metrics...', duration: 2000 },
      { status: 'Generating report...', duration: 1500 },
    ];

    let currentStep = 0;

    const processSteps = async () => {
      for (const step of steps) {
        setStatus(step.status);
        await new Promise(resolve => setTimeout(resolve, step.duration));
        currentStep++;
        setProgress((currentStep / steps.length) * 100);
      }

      // Generate analysis result
      const analysisResult = generateMockAnalysisResult();
      
      // Processing complete - navigate to report
      setTimeout(() => {
        navigate(`/report/${fileId}`, {
          state: {
            fileId,
            fileName,
            fileSize,
            analysisResult: analysisResult
          }
        });
      }, 1000);
    };

    processSteps();
  }, [fileId, fileName, fileSize, navigate]);

  if (!fileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No File Found</h2>
          <p className="text-slate-600 mb-6">Please upload a file first.</p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <RefreshCw className={`h-16 w-16 text-blue-600 ${progress < 100 ? 'animate-spin' : ''}`} />
              {progress === 100 && (
                <CheckCircle2 className="h-6 w-6 text-green-500 absolute -top-1 -right-1" />
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {progress === 100 ? 'Analysis Complete!' : 'Processing FASTA File'}
          </h1>

          <div className="mb-6">
            <p className="text-slate-600 mb-2">{fileName}</p>
            <p className="text-sm text-slate-500">
              {fileSize ? `${(fileSize / 1024).toFixed(2)} KB` : 'Calculating...'} • {fileId}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              {progress === 100 ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
              )}
              <span className="text-slate-700 font-medium">{status}</span>
            </div>
          </div>

          {/* Processing Steps */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-green-500" />
              <span className="text-sm text-slate-600">Sequence Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-sm text-slate-600">Taxonomic Classification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Processing;
