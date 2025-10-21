import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Database, TrendingUp, ChevronRight, Home,
  RefreshCw, AlertCircle, CheckCircle2,
  Users, Cpu, ArrowLeft, Search, Dna, Sparkles, Layers
} from 'lucide-react';

const Report: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLevel, setSelectedLevel] = useState<string>('kingdom');
  const [selectedTaxon, setSelectedTaxon] = useState<any | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{level: string, name: string}>>([{ level: 'kingdom', name: 'Kingdom' }]);

  // Simple hierarchical data structure
  const hierarchicalData = {
    kingdom: [
      { 
        name: 'Animalia', 
        count: 342, 
        percentage: 27.4,
        novelOrganisms: 12,
        biodiversityIndex: 0.89,
        children: ['Chordata', 'Arthropoda', 'Mollusca']
      },
      { 
        name: 'Plantae', 
        count: 287, 
        percentage: 23.0,
        novelOrganisms: 8,
        biodiversityIndex: 0.76,
        children: ['Tracheophyta', 'Bryophyta']
      },
      { 
        name: 'Fungi', 
        count: 198, 
        percentage: 15.9,
        novelOrganisms: 15,
        biodiversityIndex: 0.82,
        children: ['Basidiomycota', 'Ascomycota']
      },
      { 
        name: 'Bacteria', 
        count: 156, 
        percentage: 12.5,
        novelOrganisms: 23,
        biodiversityIndex: 0.94,
        children: ['Proteobacteria', 'Firmicutes']
      },
      { 
        name: 'Protista', 
        count: 134, 
        percentage: 10.7,
        novelOrganisms: 7,
        biodiversityIndex: 0.68,
        children: ['Sarcomastigophora']
      }
    ],
    phylum: [
      { 
        name: 'Chordata', 
        count: 285, 
        percentage: 22.8,
        novelOrganisms: 5,
        biodiversityIndex: 0.85,
        children: ['Mammalia', 'Aves']
      },
      { 
        name: 'Arthropoda', 
        count: 198, 
        percentage: 15.9,
        novelOrganisms: 8,
        biodiversityIndex: 0.79,
        children: ['Insecta']
      },
      { 
        name: 'Mollusca', 
        count: 89, 
        percentage: 7.1,
        novelOrganisms: 3,
        biodiversityIndex: 0.72,
        children: ['Gastropoda']
      },
      { 
        name: 'Tracheophyta', 
        count: 245, 
        percentage: 19.6,
        novelOrganisms: 6,
        biodiversityIndex: 0.81,
        children: ['Magnoliopsida']
      },
      { 
        name: 'Bryophyta', 
        count: 67, 
        percentage: 5.4,
        novelOrganisms: 2,
        biodiversityIndex: 0.65,
        children: ['Bryopsida']
      },
      { 
        name: 'Basidiomycota', 
        count: 120, 
        percentage: 9.6,
        novelOrganisms: 8,
        biodiversityIndex: 0.78,
        children: ['Agaricomycetes']
      },
      { 
        name: 'Ascomycota', 
        count: 78, 
        percentage: 6.3,
        novelOrganisms: 7,
        biodiversityIndex: 0.75,
        children: ['Sordariomycetes']
      },
      { 
        name: 'Proteobacteria', 
        count: 89, 
        percentage: 7.1,
        novelOrganisms: 15,
        biodiversityIndex: 0.91,
        children: ['Gammaproteobacteria']
      },
      { 
        name: 'Firmicutes', 
        count: 45, 
        percentage: 3.6,
        novelOrganisms: 6,
        biodiversityIndex: 0.84,
        children: ['Bacilli']
      },
      { 
        name: 'Sarcomastigophora', 
        count: 89, 
        percentage: 7.1,
        novelOrganisms: 4,
        biodiversityIndex: 0.71,
        children: ['Foraminifera']
      }
    ],
    class: [
      { 
        name: 'Mammalia', 
        count: 198, 
        percentage: 15.9,
        novelOrganisms: 3,
        biodiversityIndex: 0.83,
        children: ['Hominidae', 'Muridae']
      },
      { 
        name: 'Aves', 
        count: 145, 
        percentage: 11.6,
        novelOrganisms: 2,
        biodiversityIndex: 0.77,
        children: ['Passeridae']
      },
      { 
        name: 'Insecta', 
        count: 156, 
        percentage: 12.5,
        novelOrganisms: 6,
        biodiversityIndex: 0.81,
        children: ['Formicidae']
      },
      { 
        name: 'Gastropoda', 
        count: 67, 
        percentage: 5.4,
        novelOrganisms: 2,
        biodiversityIndex: 0.69,
        children: ['Helicidae']
      }
    ],
    family: [
      { 
        name: 'Hominidae', 
        count: 145, 
        percentage: 11.6,
        novelOrganisms: 1,
        biodiversityIndex: 0.75,
        children: ['Homo sapiens']
      },
      { 
        name: 'Muridae', 
        count: 98, 
        percentage: 7.9,
        novelOrganisms: 2,
        biodiversityIndex: 0.69,
        children: ['Mus musculus']
      },
      { 
        name: 'Passeridae', 
        count: 87, 
        percentage: 7.0,
        novelOrganisms: 1,
        biodiversityIndex: 0.72,
        children: ['Passer domesticus']
      }
    ],
    species: [
      { 
        name: 'Homo sapiens', 
        count: 134, 
        percentage: 10.7,
        novelOrganisms: 0,
        biodiversityIndex: 0.71
      },
      { 
        name: 'Mus musculus', 
        count: 87, 
        percentage: 7.0,
        novelOrganisms: 1,
        biodiversityIndex: 0.68
      },
      { 
        name: 'Passer domesticus', 
        count: 65, 
        percentage: 5.2,
        novelOrganisms: 0,
        biodiversityIndex: 0.65
      }
    ]
  };

  useEffect(() => {
    // Get analysis result from location state or use mock data
    if (location.state?.analysisResult) {
      setAnalysisResult(location.state.analysisResult);
      setLoading(false);
    } else {
      // If no data in state, use mock data (for development)
      setTimeout(() => {
        const mockData = generateMockAnalysisResult();
        setAnalysisResult(mockData);
        setLoading(false);
      }, 1000);
    }
  }, [location.state]);

  const generateMockAnalysisResult = () => {
    return {
      fileName: 'ref_viroids_rep_genomes.fasta',
      totalSequences: 1247,
      processingTime: 4500,
      analysisDate: new Date().toISOString(),
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

  const handleTaxonSelect = (taxon: any, level: string) => {
    const nextLevel = getNextLevel(level);
    
    if (nextLevel && taxon.children && taxon.children.length > 0) {
      setSelectedTaxon(taxon);
      setSelectedLevel(nextLevel);
      
      // Add to breadcrumbs
      const newBreadcrumbs = [...breadcrumbs];
      // Remove any existing breadcrumbs beyond the current level
      const levelIndex = newBreadcrumbs.findIndex(bc => bc.level === level);
      if (levelIndex !== -1) {
        newBreadcrumbs.splice(levelIndex + 1);
      }
      newBreadcrumbs.push({ level: nextLevel, name: taxon.name });
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    
    const targetCrumb = newBreadcrumbs[newBreadcrumbs.length - 1];
    setSelectedLevel(targetCrumb.level);
    
    if (index === 0) {
      setSelectedTaxon(null);
    } else {
      // Find the parent taxon
      const parentCrumb = newBreadcrumbs[newBreadcrumbs.length - 2];
      const parentLevelData = hierarchicalData[parentCrumb.level as keyof typeof hierarchicalData];
      const taxon = parentLevelData.find((t: any) => t.name === targetCrumb.name);
      setSelectedTaxon(taxon || null);
    }
  };

  const getNextLevel = (currentLevel: string): string | null => {
    const levels = ['kingdom', 'phylum', 'class', 'family', 'species'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const getCurrentLevelData = () => {
    if (!selectedLevel) return [];

    const levelData = hierarchicalData[selectedLevel as keyof typeof hierarchicalData] || [];
    
    if (selectedLevel === 'kingdom') {
      return levelData;
    }

    // For other levels, only show taxa that are children of the selected taxon
    if (selectedTaxon && selectedTaxon.children) {
      return levelData.filter((taxon: any) => 
        selectedTaxon.children.includes(taxon.name)
      );
    }

    return [];
  };

  const levelData = getCurrentLevelData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">Loading Report...</h2>
          <p className="text-slate-600 mt-2">Please wait while we generate your analysis report</p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Analysis Data Found</h2>
          <p className="text-slate-600 mb-6">Please upload and process a FASTA file first.</p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
          >
            Upload FASTA File
          </button>
        </div>
      </div>
    );
  }

  const overallStats = [
    { 
      label: 'Total Sequences', 
      value: analysisResult.totalSequences.toLocaleString(), 
      icon: Database,
      description: 'Sequences analyzed'
    },
    { 
      label: 'Species Richness', 
      value: analysisResult.biodiversityIndices.speciesRichness, 
      icon: Users,
      description: 'Unique species'
    },
    { 
      label: 'Novel Organisms', 
      value: analysisResult.novelOrganisms.total, 
      icon: Sparkles,
      description: 'Potential discoveries'
    },
    { 
      label: 'Processing Time', 
      value: (analysisResult.processingTime / 1000).toFixed(1) + 's', 
      icon: Cpu,
      description: 'Analysis duration'
    }
  ];

  const metrics = [
    { 
      name: 'Shannon Index', 
      value: analysisResult.biodiversityIndices.shannonIndex, 
      description: 'Species diversity',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      name: 'Simpson Index', 
      value: analysisResult.biodiversityIndices.simpsonIndex, 
      description: 'Dominance measure',
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      name: 'Evenness', 
      value: analysisResult.biodiversityIndices.evenness, 
      description: 'Distribution balance',
      color: 'from-purple-500 to-violet-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
              <ChevronRight className="h-4 w-4" />
              <button 
                onClick={() => navigate('/upload')}
                className="hover:text-blue-600 transition-colors"
              >
                Upload
              </button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-blue-600 font-semibold">Analysis Report</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Biodiversity Analysis Report
            </h1>
            <p className="text-lg text-slate-600">
              {analysisResult.fileName} • Analyzed on {new Date(analysisResult.analysisDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {overallStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border border-slate-200">
                <div className="bg-gradient-to-r from-blue-500 to-teal-400 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-700 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Biodiversity Metrics */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border border-green-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            Biodiversity Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div key={metric.name} className="text-center bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className={`bg-gradient-to-br ${metric.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg`}>
                  {metric.value.toFixed(2)}
                </div>
                <div className="text-lg font-semibold text-slate-900 mb-2">{metric.name}</div>
                <div className="text-sm text-slate-600">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Taxonomic Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <Layers className="w-6 h-6 mr-2 text-blue-600" />
              Taxonomic Distribution Explorer
            </h2>
            {selectedLevel !== 'kingdom' && (
              <button
                onClick={() => {
                  setSelectedLevel('kingdom');
                  setSelectedTaxon(null);
                  setBreadcrumbs([{ level: 'kingdom', name: 'Kingdom' }]);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Kingdoms</span>
              </button>
            )}
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center space-x-2 mb-6">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className={`text-sm ${
                      index === breadcrumbs.length - 1 
                        ? 'text-slate-900 font-semibold' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {crumb.name}
                  </button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Level Title */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 capitalize">
              {selectedLevel} Level
              {selectedTaxon && ` - ${selectedTaxon.name}`}
            </h3>
          </div>

          {/* Taxon List */}
          {levelData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {levelData.map((taxon: any, index: number) => (
                <div
                  key={taxon.name}
                  className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handleTaxonSelect(taxon, selectedLevel)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                        {taxon.name}
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {taxon.count.toLocaleString()} sequences ({taxon.percentage}%)
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {taxon.children && taxon.children.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {taxon.children.length} children
                        </span>
                      )}
                      {selectedLevel !== 'species' && taxon.children && taxon.children.length > 0 && (
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-amber-600 mb-1">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-semibold">{taxon.novelOrganisms}</span>
                      </div>
                      <div className="text-xs text-slate-500">Novel Organisms</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold">{(taxon.biodiversityIndex * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-xs text-slate-500">Biodiversity Index</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Data Available</h3>
              <p className="text-slate-600">
                No {selectedLevel} data found {selectedTaxon ? `for ${selectedTaxon.name}` : ''}.
              </p>
            </div>
          )}
        </div>

        {/* Novel Organisms Summary */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
            Potential Novel Organisms Discovered
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Total Novel Organisms: {analysisResult.novelOrganisms.total}</h4>
              <div className="space-y-3">
                {analysisResult.novelOrganisms.byKingdom.map((item: any, index: number) => (
                  <div key={item.kingdom} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                    <span className="font-medium text-slate-900">{item.kingdom}</span>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-purple-600">{item.count}</span>
                      <span className="text-sm text-slate-500">({(item.confidence * 100).toFixed(0)}% confidence)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-purple-200">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Novelty Assessment</h4>
              <p className="text-slate-600 text-sm mb-4">
                Based on sequence similarity analysis and comparison with reference databases. 
                Organisms with less than 97% similarity to known species are flagged as potential novel discoveries.
              </p>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Dna className="h-4 w-4 text-purple-600" />
                <span>High confidence threshold: ≥85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sequence Statistics & Quality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sequence Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Sequence Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-slate-600">Total Length</span>
                <span className="font-semibold text-slate-900">
                  {(analysisResult.sequenceStats.totalLength / 1000000).toFixed(2)} Mb
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-slate-600">Average Length</span>
                <span className="font-semibold text-slate-900">
                  {analysisResult.sequenceStats.averageLength.toLocaleString()} bp
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-slate-600">GC Content</span>
                <span className="font-semibold text-slate-900">
                  {analysisResult.sequenceStats.gcContent}%
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-600">N Content</span>
                <span className="font-semibold text-slate-900">
                  {analysisResult.sequenceStats.nContent}%
                </span>
              </div>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
              Quality Assessment
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Quality Score</span>
                  <span className="text-sm font-bold text-green-600">
                    {analysisResult.qualityMetrics.qualityScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.qualityMetrics.qualityScore}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Completeness</span>
                  <span className="text-sm font-bold text-blue-600">
                    {analysisResult.qualityMetrics.completeness}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.qualityMetrics.completeness}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Contamination Risk</span>
                  <span className="text-sm font-bold text-green-600">
                    {analysisResult.qualityMetrics.contaminationRisk}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.qualityMetrics.contaminationRisk}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
