"use client";

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { useInquiries } from '@/context/InquiryContext';
import { useAuth } from '@/context/AuthContext';

interface HireModalProps {
  creatorId: string;
  creatorName: string;
  isOpen: boolean;
  onClose: () => void;
}

const HireModal: React.FC<HireModalProps> = ({ creatorId, creatorName, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const { sendInquiry } = useInquiries();
  const { user, profile } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const brandName = profile?.display_name || user?.user_metadata?.display_name || 'Anonymous Brand';
    sendInquiry(creatorId, brandName, message);
    showSuccess(`Inquiry sent to ${creatorName}!`);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Hire {creatorName}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Project Brief</label>
              <textarea
                required
                className="w-full px-5 py-4 border border-gray-200 rounded-[1.5rem] focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none h-40 text-gray-700"
                placeholder="Tell the creator about your campaign goals, budget, and timeline..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <div className="bg-blue-50/50 p-5 rounded-2xl mb-4 border border-blue-100">
              <p className="text-sm text-blue-700 leading-relaxed font-medium">
                <strong className="block mb-1">💡 ProTip:</strong> Creators respond faster when you include specific dates and budget ranges.
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