"use client";

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface HireModalProps {
  creatorName: string;
  isOpen: boolean;
  onClose: () => void;
}

const HireModal: React.FC<HireModalProps> = ({ creatorName, isOpen, onClose }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess(`Inquiry sent to ${creatorName}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Hire {creatorName}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Project Brief</label>
              <textarea
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none h-32"
                placeholder="Tell the creator about your campaign goals, budget, and timeline..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl mb-4">
              <p className="text-sm text-blue-700 leading-relaxed">
                <strong>ProTip:</strong> Creators are 3x more likely to respond when you include specific dates and budget ranges.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
            >
              Send Inquiry
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HireModal;