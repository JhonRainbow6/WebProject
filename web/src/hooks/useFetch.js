import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const source = axios.CancelToken.source();

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(url, {
                    cancelToken: source.token,
                });
                setData(response.data);
                setError(null);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Fetch canceled');
                } else {
                    setError('Error al cargar los datos');
                    console.error('Error:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData().then(r => r).catch(console.error);

        return () => {
            source.cancel();
        };
    }, [url]);

    return { data, loading, error };
};

export default useFetch;

