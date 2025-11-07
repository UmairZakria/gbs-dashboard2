import React, { useState, useEffect } from 'react';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { bookService, Author, Publisher, BookSeries } from '../services/bookService';
import { AuthorForm, PublisherForm, BookSeriesForm } from '../components/books';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Table, { Column } from '../components/ui/Table';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Books: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [bookSeries, setBookSeries] = useState<BookSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'authors' | 'publishers' | 'series'>('authors');
  
  // Form states
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showPublisherForm, setShowPublisherForm] = useState(false);
  const [showBookSeriesForm, setShowBookSeriesForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);
  const [editingBookSeries, setEditingBookSeries] = useState<BookSeries | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (activeTab === 'authors') {
        const [authorsRes, statsRes] = await Promise.all([
          bookService.getActiveAuthors(),
          bookService.getAuthorStats()
        ]);
        setAuthors(authorsRes.data || []);
        setStats(statsRes.data);
      } else if (activeTab === 'publishers') {
        const [publishersRes, statsRes] = await Promise.all([
          bookService.getActivePublishers(),
          bookService.getPublisherStats()
        ]);
        setPublishers(publishersRes.data || []);
        setStats(statsRes.data);
      } else {
        const [seriesRes, statsRes] = await Promise.all([
          bookService.getActiveSeries(),
          bookService.getSeriesStats()
        ]);
        setBookSeries(seriesRes.data || []);
        setStats(statsRes.data);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: Author | Publisher | BookSeries) => {
    if (activeTab === 'authors') {
      setEditingAuthor(item as Author);
      setShowAuthorForm(true);
    } else if (activeTab === 'publishers') {
      setEditingPublisher(item as Publisher);
      setShowPublisherForm(true);
    } else {
      setEditingBookSeries(item as BookSeries);
      setShowBookSeriesForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (activeTab === 'authors') {
          await bookService.deleteAuthor(id);
        } else if (activeTab === 'publishers') {
          await bookService.deletePublisher(id);
        } else {
          await bookService.deleteBookSeries(id);
        }
        await loadData();
      } catch (err) {
        console.error('Error deleting item:', err);
        alert('Failed to delete item');
      }
    }
  };

  const handleAddNew = () => {
    if (activeTab === 'authors') {
      setEditingAuthor(null);
      setShowAuthorForm(true);
    } else if (activeTab === 'publishers') {
      setEditingPublisher(null);
      setShowPublisherForm(true);
    } else {
      setEditingBookSeries(null);
      setShowBookSeriesForm(true);
    }
  };

  const handleAuthorSubmit = async (data: Partial<Author>) => {
    try {
      if (editingAuthor) {
        await bookService.updateAuthor(editingAuthor._id, data);
      } else {
        await bookService.createAuthor(data);
      }
      setShowAuthorForm(false);
      setEditingAuthor(null);
      await loadData();
    } catch (err) {
      console.error('Error saving author:', err);
      alert('Failed to save author');
    }
  };

  const handlePublisherSubmit = async (data: Partial<Publisher>) => {
    try {
      if (editingPublisher) {
        await bookService.updatePublisher(editingPublisher._id, data);
      } else {
        await bookService.createPublisher(data);
      }
      setShowPublisherForm(false);
      setEditingPublisher(null);
      await loadData();
    } catch (err) {
      console.error('Error saving publisher:', err);
      alert('Failed to save publisher');
    }
  };

  const handleBookSeriesSubmit = async (data: Partial<BookSeries>) => {
    try {
      if (editingBookSeries) {
        await bookService.updateBookSeries(editingBookSeries._id, data);
      } else {
        await bookService.createBookSeries(data);
      }
      setShowBookSeriesForm(false);
      setEditingBookSeries(null);
      await loadData();
    } catch (err) {
      console.error('Error saving book series:', err);
      alert('Failed to save book series');
    }
  };

  // Update action handlers
  const updateAuthorActions = () => {
    return authorColumns.map(col => {
      if (col.key === 'actions') {
        return {
          ...col,
          render: (author: Author) => (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(author)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(author._id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ),
        };
      }
      return col;
    });
  };

  const updatePublisherActions = () => {
    return publisherColumns.map(col => {
      if (col.key === 'actions') {
        return {
          ...col,
          render: (publisher: Publisher) => (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(publisher)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(publisher._id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ),
        };
      }
      return col;
    });
  };

  const updateSeriesActions = () => {
    return seriesColumns.map(col => {
      if (col.key === 'actions') {
        return {
          ...col,
          render: (series: BookSeries) => (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(series)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(series._id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ),
        };
      }
      return col;
    });
  };

  const authorColumns = [
    {
      key: 'name',
      label: 'Name',
      render: (author: Author) => (
        <div>
          <div className="font-medium">{author.name}</div>
          <div className="text-sm text-gray-500">{author.nationality || 'Unknown'}</div>
        </div>
      ),
    },
    {
      key: 'booksCount',
      label: 'Books',
      render: (author: Author) => (
        <div className="font-mono">{author.booksCount}</div>
      ),
    },
    {
      key: 'genres',
      label: 'Genres',
      render: (author: Author) => (
        <div className="flex flex-wrap gap-1">
          {author.genres?.slice(0, 3).map((genre, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {genre}
            </span>
          ))}
          {author.genres && author.genres.length > 3 && (
            <span className="text-xs text-gray-500">+{author.genres.length - 3} more</span>
          )}
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (author: Author) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          author.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
        }`}>
          {author.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (author: Author) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle view */}}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle edit */}}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle delete */}}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const publisherColumns = [
    {
      key: 'name',
      label: 'Name',
      render: (publisher: Publisher) => (
        <div>
          <div className="font-medium">{publisher.name}</div>
          <div className="text-sm text-gray-500">{publisher.foundedYear || 'Unknown year'}</div>
        </div>
      ),
    },
    {
      key: 'booksCount',
      label: 'Books',
      render: (publisher: Publisher) => (
        <div className="font-mono">{publisher.booksCount}</div>
      ),
    },
    {
      key: 'specialties',
      label: 'Specialties',
      render: (publisher: Publisher) => (
        <div className="flex flex-wrap gap-1">
          {publisher.specialties?.slice(0, 2).map((specialty, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              {specialty}
            </span>
          ))}
          {publisher.specialties && publisher.specialties.length > 2 && (
            <span className="text-xs text-gray-500">+{publisher.specialties.length - 2} more</span>
          )}
        </div>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (publisher: Publisher) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          publisher.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
        }`}>
          {publisher.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (publisher: Publisher) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle view */}}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle edit */}}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle delete */}}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const seriesColumns = [
    {
      key: 'name',
      label: 'Series Name',
      render: (series: BookSeries) => (
        <div>
          <div className="font-medium">{series.name}</div>
          <div className="text-sm text-gray-500">{series.genre || 'Unknown genre'}</div>
        </div>
      ),
    },
    {
      key: 'totalBooks',
      label: 'Books',
      render: (series: BookSeries) => (
        <div className="font-mono">{series.totalBooks}</div>
      ),
    },
    {
      key: 'isOngoing',
      label: 'Status',
      render: (series: BookSeries) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          series.isOngoing ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'
        }`}>
          {series.isOngoing ? 'Ongoing' : 'Completed'}
        </span>
      ),
    },
    {
      key: 'ageGroup',
      label: 'Age Group',
      render: (series: BookSeries) => (
        <div>{series.ageGroup || '-'}</div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (series: BookSeries) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle view */}}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle edit */}}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {/* Handle delete */}}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Book Management</h1>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add {activeTab === 'authors' ? 'Author' : activeTab === 'publishers' ? 'Publisher' : 'Series'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('authors')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'authors'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Authors
          </button>
          <button
            onClick={() => setActiveTab('publishers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'publishers'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Publishers
          </button>
          <button
            onClick={() => setActiveTab('series')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'series'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Book Series
          </button>
        </nav>
      </div>

      {/* Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activeTab === 'authors' ? (
            <>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Authors</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalAuthors}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Active Authors</div>
                  <div className="text-2xl font-bold text-green-600">{stats.activeAuthors}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Books</div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalBooks}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Avg Books/Author</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.averageBooksPerAuthor}</div>
                </div>
              </Card>
            </>
          ) : activeTab === 'publishers' ? (
            <>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Publishers</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalPublishers}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Active Publishers</div>
                  <div className="text-2xl font-bold text-green-600">{stats.activePublishers}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Books</div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalBooks}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Avg Books/Publisher</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.averageBooksPerPublisher}</div>
                </div>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Series</div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalSeries}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Active Series</div>
                  <div className="text-2xl font-bold text-green-600">{stats.activeSeries}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Ongoing Series</div>
                  <div className="text-2xl font-bold text-blue-600">{stats.ongoingSeries}</div>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Books</div>
                  <div className="text-2xl font-bold text-purple-600">{stats.totalBooks}</div>
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Data Table */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {activeTab === 'authors' ? 'Authors' : activeTab === 'publishers' ? 'Publishers' : 'Book Series'}
          </h2>
          <Table
            data={activeTab === 'authors' ? authors : activeTab === 'publishers' ? publishers : bookSeries}
            columns={(activeTab === 'authors' 
              ? updateAuthorActions()
              : activeTab === 'publishers'
              ? updatePublisherActions()
              : updateSeriesActions()) as Array<Column<any>>}
            emptyMessage={`No ${activeTab} found`}
          />
        </div>
      </Card>

      {/* Author Form Modal */}
      {showAuthorForm && (
        <AuthorForm
          author={editingAuthor || undefined}
          onSubmit={handleAuthorSubmit}
          onCancel={() => {
            setShowAuthorForm(false);
            setEditingAuthor(null);
          }}
        />
      )}

      {/* Publisher Form Modal */}
      {showPublisherForm && (
        <PublisherForm
          publisher={editingPublisher || undefined}
          onSubmit={handlePublisherSubmit}
          onCancel={() => {
            setShowPublisherForm(false);
            setEditingPublisher(null);
          }}
        />
      )}

      {/* Book Series Form Modal */}
      {showBookSeriesForm && (
        <BookSeriesForm
          bookSeries={editingBookSeries || undefined}
          authors={authors}
          publishers={publishers}
          onSubmit={handleBookSeriesSubmit}
          onCancel={() => {
            setShowBookSeriesForm(false);
            setEditingBookSeries(null);
          }}
        />
      )}
    </div>
  );
};

export default Books;