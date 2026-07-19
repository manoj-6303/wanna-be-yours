import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const levelNumber = location.state?.levelNumber || 1;
  const [loading, setLoading] = useState(false);

  const handlePayment = async (method) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await axios.post('/api/v1/payments', {
        level: levelNumber,
        amount: 20,
        paymentMethod: method
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect directly to the exam
      navigate(`/exam`, { state: { levelNumber } });
    } catch (error) {
      console.error('Payment failed', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 p-6 text-center text-white">
          <h2 className="text-2xl font-bold">Unlock Level {levelNumber}</h2>
          <p className="mt-2 text-indigo-100">Complete payment to start your mock test</p>
        </div>
        
        <div className="p-8 text-center">
          <div className="text-5xl font-extrabold text-gray-900 mb-8">₹20</div>
          
          <div className="space-y-4">
            <button 
              disabled={loading}
              onClick={() => handlePayment('UPI')}
              className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay with UPI'}
            </button>
            <button 
              disabled={loading}
              onClick={() => handlePayment('Card')}
              className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition disabled:opacity-50"
            >
              Pay with Credit/Debit Card
            </button>
            <button 
              disabled={loading}
              onClick={() => handlePayment('NetBanking')}
              className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition disabled:opacity-50"
            >
              Net Banking
            </button>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-6 text-gray-500 hover:text-gray-700 font-medium text-sm"
          >
            Cancel and return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
