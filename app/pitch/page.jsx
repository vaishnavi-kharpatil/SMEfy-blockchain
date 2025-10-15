'use client'
import React, { useState } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useSearchParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const highlightTags = [
  'Green Buildings',
  'Sustainable Agriculture',
  'Sustainable Forestry',
  'Green Transportation',
  'Waste Management',
  'Recycling'
];

const App = () => {
  const [pitch, setPitch] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const router = useRouter();
  const search = useSearchParams();
  const applicationId = search.get('id');
  const [customPreference, setCustomPreference] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [availablePreferences, setAvailablePreferences] = useState([
    'Technology', 'Manufacturing', 'Healthcare', 'Agribusiness',
    'Renewable-Energy', 'Education', 'E-commerce', 'Infrastructure',
    'Financial-Services', 'Consumer-Goods', 'Artisanal-and-Handicrafts',
    'Sustainable-and-Social-Enterprises', 'Green Buildings',
    'Sustainable Agriculture', 'Sustainable Forestry',
    'Green Transportation', 'Waste Management', 'Recycling'
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pitch.trim()) {
      toast.error('Please enter your pitch');
      return;
    }
    if (selectedPreferences.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }
    if (!videoLink.trim()) {
      toast.error('Please enter a video link');
      return;
    }

    try {
      const tagsWithSpecialFlag = selectedPreferences.map(tag => {
        if (highlightTags.includes(tag)) {
          return { tag, isSpecial: true };
        }
        return { tag, isSpecial: false };
      });

      const hasSpecialTag = tagsWithSpecialFlag.some(tag => tag.isSpecial);

      const applicationRef = doc(db, "applications", applicationId.toString());
      await setDoc(applicationRef, {
        pitch,
        tags: tagsWithSpecialFlag,
        videoLink,
        ...(hasSpecialTag && { isSpecial: true }),
      }, { merge: true });

      toast.success('Application submitted successfully');
      router.push('/viewapplication/?id=' + applicationId.toString());
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error('Error submitting application');
    }
  };

  return (
    <div className="min-h-screen  p-8 mt-4">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className=" rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-white">Submit Your Pitch</h2>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Tell us what you need and why!"
                className="w-full h-48 p-4 border rounded-lg  border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-white">Share Video Link</h3>
              <input
                type="url"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                placeholder="Paste your video link here (YouTube, Drive, etc.)"
                className="w-full p-2 border rounded-lg border-gray-600 text-black placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className=" rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-white">Tags</h2>
            <p className="text-gray-300 mb-4">Select tags that will allow us to identify you better:</p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {availablePreferences.map(preference => (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => {
                      setSelectedPreferences(prev => [...prev, preference]);
                      setAvailablePreferences(prev => prev.filter(p => p !== preference));
                    }}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                      highlightTags.includes(preference)
                        ? 'text-green-200 bg-green-600 shadow-lg'
                        : 'text-gray-200 hover:text-white'
                    }`}
                  >
                    {preference}
                    <span className="text-purple-400">+</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPreference}
                  onChange={(e) => setCustomPreference(e.target.value)}
                  placeholder="Enter custom tag"
                  className="flex-1 px-3 py-2 border rounded-lg  border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customPreference.trim()) {
                      setSelectedPreferences(prev => [...prev, customPreference.trim()]);
                      setCustomPreference('');
                    }
                  }}
                  className="px-4 py-2  text-white rounded-lg hover:"
                >
                  Add
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-white">Selected Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPreferences.map((pref, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        highlightTags.includes(pref)
                          ? 'text-green-200 bg-green-600 shadow-lg'
                          : 'text-purple-100'
                      }`}
                    >
                      {pref}
                      <button
                        type="button"
                        onClick={() => {
                          setAvailablePreferences(prev => [...prev, pref]);
                          setSelectedPreferences(prev => prev.filter(p => p !== pref));
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-8 py-3  text-white rounded-lg hover: font-semibold shadow-lg hover:shadow-xl transition-all bg-blue-800"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
