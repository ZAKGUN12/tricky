import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { countries } from '../lib/mockData';

function SubmitForm() {
  const router = useRouter();
  // Mock user for now
  const user = { 
    username: 'demo@example.com',
    userId: 'demo-user-123',
    signInDetails: { loginId: 'demo@example.com' }
  };

  const [form, setForm] = useState({
    title: '',
    description: '',
    steps: ['', '', ''],
    countryCode: '',
    tags: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    timeEstimate: '',
    category: 'general'
  });
  const [submitting, setSubmitting] = useState(false);
  const [isStepBased, setIsStepBased] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...form.steps];
    newSteps[index] = value;
    setForm(prev => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    setForm(prev => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const removeStep = (index: number) => {
    if (form.steps.length > 1) {
      const newSteps = form.steps.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.countryCode) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const trickData = {
        ...form,
        id: Date.now().toString(),
        authorId: user.userId,
        authorName: user.signInDetails?.loginId?.split('@')[0] || 'Anonymous',
        kudos: 0,
        views: 0,
        favorites: 0,
        comments: 0,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        steps: isStepBased ? form.steps.filter(step => step.trim()) : []
      };

      console.log('Submitting trick:', trickData);
      alert('Trick submitted successfully! It will be reviewed before publishing.');
      router.push('/');
    } catch (error) {
      console.error('Error submitting trick:', error);
      alert('Error submitting trick. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountry = countries.find(c => c.code === form.countryCode);

  return (
    <div className="container">
      <div className="submit-header">
        <h1>✨ Share Your Trick</h1>
        <p>Help others by sharing your amazing life tricks and tips</p>
      </div>

      <div className="submit-container">
        {/* Form Type Toggle */}
        <div className="form-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${isStepBased ? 'active' : ''}`}
            onClick={() => setIsStepBased(true)}
          >
            📋 Step-by-Step Guide
          </button>
          <button
            type="button"
            className={`toggle-btn ${!isStepBased ? 'active' : ''}`}
            onClick={() => setIsStepBased(false)}
          >
            💡 Quick Tip
          </button>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>📝 Basic Information</h2>
            
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Give your trick a catchy title..."
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
                required
              />
              <div className="char-count">{form.title.length}/100</div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Describe what your trick does and why it's useful..."
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                maxLength={500}
                required
              />
              <div className="char-count">{form.description.length}/500</div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Country/Origin *</label>
                <select
                  className="form-select"
                  value={form.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  required
                >
                  <option value="">Select country...</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="general">🌟 General</option>
                  <option value="cooking">🍳 Cooking</option>
                  <option value="cleaning">🧹 Cleaning</option>
                  <option value="productivity">⚡ Productivity</option>
                  <option value="health">💪 Health & Wellness</option>
                  <option value="technology">💻 Technology</option>
                  <option value="travel">✈️ Travel</option>
                  <option value="diy">🔨 DIY & Crafts</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="form-section">
            <h2>{isStepBased ? '📋 Steps' : '💡 Tip Content'}</h2>
            
            {isStepBased ? (
              <div className="steps-container">
                {form.steps.map((step, index) => (
                  <div key={index} className="step-input-group">
                    <label className="step-label">Step {index + 1}</label>
                    <div className="step-input-container">
                      <textarea
                        className="form-textarea step-input"
                        placeholder={`Describe step ${index + 1}...`}
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        rows={2}
                      />
                      {form.steps.length > 1 && (
                        <button
                          type="button"
                          className="remove-step"
                          onClick={() => removeStep(index)}
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="add-step"
                  onClick={addStep}
                  disabled={form.steps.length >= 10}
                >
                  ➕ Add Step ({form.steps.length}/10)
                </button>
              </div>
            ) : (
              <div className="tip-editor">
                <p className="tip-note">
                  💡 For quick tips, provide a detailed explanation in the description above. 
                  No steps needed - just share your wisdom!
                </p>
              </div>
            )}
          </div>

          {/* Images Section */}
          <div className="form-section">
            <h2>📸 Images (Optional)</h2>
            <div className="image-upload">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="image-input"
              />
              <label htmlFor="images" className="image-upload-label">
                📷 Add Images (Max 5)
              </label>
              
              {images.length > 0 && (
                <div className="image-previews">
                  {images.map((image, index) => (
                    <div key={index} className="image-preview">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`}
                        className="preview-img"
                      />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Metadata Section */}
          <div className="form-section">
            <h2>⚙️ Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <div className="difficulty-selector">
                  {(['easy', 'medium', 'hard'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      className={`difficulty-option ${form.difficulty === level ? 'active' : ''}`}
                      onClick={() => handleInputChange('difficulty', level)}
                    >
                      {level === 'easy' ? '🟢 Easy' : 
                       level === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Time Required</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 5 minutes, 1 hour, etc."
                  value={form.timeEstimate}
                  onChange={(e) => handleInputChange('timeEstimate', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                className="form-input"
                placeholder="cooking, quick, kitchen, etc. (comma separated)"
                value={form.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
              />
              <div className="form-help">Add relevant tags to help others find your trick</div>
            </div>
          </div>

          {/* Preview Section */}
          {previewMode && (
            <div className="form-section preview-section">
              <h2>👀 Preview</h2>
              <div className="trick-preview">
                <div className="preview-header">
                  <h3>{form.title || 'Your Trick Title'}</h3>
                  <div className="preview-meta">
                    <span>{selectedCountry?.flag} {selectedCountry?.name}</span>
                    <span>{form.difficulty === 'easy' ? '🟢' : form.difficulty === 'medium' ? '🟡' : '🔴'} {form.difficulty}</span>
                    {form.timeEstimate && <span>⏱️ {form.timeEstimate}</span>}
                  </div>
                </div>
                <p className="preview-description">{form.description || 'Your trick description will appear here...'}</p>
                
                {isStepBased && form.steps.some(step => step.trim()) && (
                  <ol className="preview-steps">
                    {form.steps.filter(step => step.trim()).map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                )}
                
                {form.tags && (
                  <div className="preview-tags">
                    {form.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="preview-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="preview-btn"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? '📝 Edit' : '👀 Preview'}
            </button>
            
            <div className="submit-actions">
              <Link href="/" className="cancel-btn">
                Cancel
              </Link>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting || !form.title || !form.description || !form.countryCode}
              >
                {submitting ? '⏳ Submitting...' : '🚀 Submit Trick'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <Link href="/" className="nav-btn">🏠 Home</Link>
        <Link href="/submit" className="nav-btn active">➕ Submit</Link>
        <Link href="/profile" className="nav-btn">👤 Profile</Link>
      </nav>
    </div>
  );
}

export default function Submit() {
  return <SubmitForm />;
}
