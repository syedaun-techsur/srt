import { useState } from 'react';
import { API_BASE_URL } from '../constants';
import type { CreateRequestPayload } from '../types';

interface SubmissionFormProps {
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  title?: string;
  description?: string;
}

function SubmissionForm({ onSuccess }: SubmissionFormProps) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!title.trim()) errs.title = 'Request Title is required.';
    if (!description.trim()) errs.description = 'Description is required.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return; // do not call API
    }

    setErrors({});
    setIsSubmitting(true);

    const payload: CreateRequestPayload = { name: name.trim(), title: title.trim(), description: description.trim() };

    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Success: reset form and navigate to list
      setName('');
      setTitle('');
      setDescription('');
      onSuccess();
    } catch {
      setFormError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Submit Request</h2>

      {formError && <p role="alert">{formError}</p>}

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <span id="name-error" role="alert">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="title">Request Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && <span id="title-error" role="alert">{errors.title}</span>}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && <span id="description-error" role="alert">{errors.description}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

export default SubmissionForm;
