import { useState } from 'react';
import type { CreateRequestPayload } from '../types';
import { API_BASE_URL } from '../constants';

interface SubmissionFormProps {
  onSuccess: () => void;
}

interface FieldErrors {
  name?: string;
  title?: string;
  description?: string;
}

function SubmissionForm({ onSuccess }: SubmissionFormProps) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!title.trim()) errors.title = 'Request Title is required';
    if (!description.trim()) errors.description = 'Description is required';
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const payload: CreateRequestPayload = {
      name: name.trim(),
      title: title.trim(),
      description: description.trim(),
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      onSuccess();
    } catch {
      setApiError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Submit Request</h2>

      {apiError && <p role="alert">{apiError}</p>}

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {fieldErrors.name && <span role="alert">{fieldErrors.name}</span>}
      </div>

      <div>
        <label htmlFor="title">Request Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {fieldErrors.title && <span role="alert">{fieldErrors.title}</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {fieldErrors.description && <span role="alert">{fieldErrors.description}</span>}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default SubmissionForm;
