// src/components/FormPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTemplate } from '../services/template-service';
import { Template } from '../types';

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // extract id from the URL
  const [template, setTemplate] = useState<Template | null >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const data = await fetchTemplate(id as string);
        setTemplate(data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch template');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getTemplate();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Template Data</h1>
      <pre>{JSON.stringify(template, null, 2)}</pre> {/* display template data as JSON */}
    </div>
  );
};

export default FormPage;
