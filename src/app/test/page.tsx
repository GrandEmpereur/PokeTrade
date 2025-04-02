'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface DatabaseTestData {
  success: boolean;
  dbStatus: string;
  data?: {
    users: any[];
    posts: any[];
    products: any[];
    cards: any[];
    collections: any[];
    trades: any[];
    models: Record<string, number>;
  };
  error?: string;
  details?: string;
}

export default function DatabaseTestPage() {
  const [data, setData] = useState<DatabaseTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/db');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Database Test</h1>
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !data || !data.success) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Database Test</h1>
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">
              Database Connection Failed
            </CardTitle>
            <CardDescription>
              {error || data?.error || 'Unknown error occurred'}
            </CardDescription>
          </CardHeader>
          {data?.details && (
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {data.details}
              </pre>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Database Test</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Database Status
            <Badge className="bg-green-500">{data.dbStatus}</Badge>
          </CardTitle>
          <CardDescription>
            Below is a summary of the database records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {Object.entries(data.data?.models || {}).map(([model, count]) => (
              <div key={model} className="border rounded p-4 text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-500">{model}s</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <DataTable
            data={data.data?.users || []}
            title="Users"
            limit={5}
            fields={['id', 'name', 'email', 'username', 'role']}
          />
        </TabsContent>

        <TabsContent value="posts">
          <DataTable
            data={data.data?.posts || []}
            title="Posts"
            limit={5}
            fields={['id', 'title', 'published', 'author.name']}
          />
        </TabsContent>

        <TabsContent value="products">
          <DataTable
            data={data.data?.products || []}
            title="Products"
            limit={5}
            fields={['id', 'name', 'price', 'createdAt']}
          />
        </TabsContent>

        <TabsContent value="cards">
          <DataTable
            data={data.data?.cards || []}
            title="Cards"
            limit={5}
            fields={['id', 'name', 'setName', 'rarity', 'price', 'condition']}
          />
        </TabsContent>

        <TabsContent value="collections">
          <DataTable
            data={data.data?.collections || []}
            title="Collections"
            limit={5}
            fields={['id', 'name', 'user.name', '_count.cards', 'isPrivate']}
          />
        </TabsContent>

        <TabsContent value="trades">
          <DataTable
            data={data.data?.trades || []}
            title="Trades"
            limit={5}
            fields={[
              'id',
              'initiator.name',
              'receiver.name',
              'status',
              '_count.items',
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DataTableProps {
  data: any[];
  title: string;
  limit: number;
  fields: string[];
}

function DataTable({ data, title, limit, fields }: DataTableProps) {
  // Helper function to get nested field values (e.g., 'author.name')
  const getFieldValue = (item: any, field: string) => {
    const parts = field.split('.');
    let value = item;

    for (const part of parts) {
      if (value === null || value === undefined) return '';
      value = value[part];
    }

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    return value;
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-gray-500">
            No {title.toLowerCase()} found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Showing {Math.min(data.length, limit)} of {data.length} records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {fields.map((field) => (
                  <th
                    key={field}
                    className="text-left p-2 font-medium text-gray-500"
                  >
                    {field.split('.').join(' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, limit).map((item) => (
                <tr key={item.id} className="border-b">
                  {fields.map((field) => (
                    <td key={`${item.id}-${field}`} className="p-2">
                      {getFieldValue(item, field)?.toString() || '–'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
