import api from './api';
import { ApiResponse } from '../types';

export interface Author {
  _id: string;
  name: string;
  slug: string;
  biography?: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  nationality?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  photoUrl?: string;
  isActive: boolean;
  booksCount: number;
  awards?: string[];
  genres?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Publisher {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  foundedYear?: number;
  logoUrl?: string;
  isActive: boolean;
  booksCount: number;
  specialties?: string[];
  imprints?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BookSeries {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  authorId?: string;
  publisherId?: string;
  genre?: string;
  ageGroup?: string;
  totalBooks: number;
  isOngoing: boolean;
  firstPublishedYear?: number;
  lastPublishedYear?: number;
  coverImageUrl?: string;
  isActive: boolean;
  bookIds?: string[];
  seriesOrder?: Array<{
    bookId: string;
    order: number;
    title: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const bookService = {
  // Authors
  async getAuthors(page = 1, limit = 20): Promise<ApiResponse<{ data: Author[] }>> {
    const response = await api.get(`/authors?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getAuthorStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/authors/stats');
    return response.data;
  },

  async getActiveAuthors(): Promise<ApiResponse<Author[]>> {
    const response = await api.get('/authors/active');
    return response.data;
  },

  async getTopAuthors(limit = 10): Promise<ApiResponse<Author[]>> {
    const response = await api.get(`/authors/top?limit=${limit}`);
    return response.data;
  },

  async searchAuthors(searchTerm: string): Promise<ApiResponse<Author[]>> {
    const response = await api.get(`/authors/search?q=${searchTerm}`);
    return response.data;
  },

  async getAuthorsByGenre(genre: string): Promise<ApiResponse<Author[]>> {
    const response = await api.get(`/authors/genre/${genre}`);
    return response.data;
  },

  async getAuthorBySlug(slug: string): Promise<ApiResponse<Author>> {
    const response = await api.get(`/authors/slug/${slug}`);
    return response.data;
  },

  async createAuthor(data: Partial<Author>): Promise<ApiResponse<Author>> {
    const response = await api.post('/authors', data);
    return response.data;
  },

  async updateAuthor(id: string, data: Partial<Author>): Promise<ApiResponse<Author>> {
    const response = await api.put(`/authors/${id}`, data);
    return response.data;
  },

  async deleteAuthor(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/authors/${id}`);
    return response.data;
  },

  // Publishers
  async getPublishers(page = 1, limit = 20): Promise<ApiResponse<{ data: Publisher[] }>> {
    const response = await api.get(`/publishers?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPublisherStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/publishers/stats');
    return response.data;
  },

  async getActivePublishers(): Promise<ApiResponse<Publisher[]>> {
    const response = await api.get('/publishers/active');
    return response.data;
  },

  async getTopPublishers(limit = 10): Promise<ApiResponse<Publisher[]>> {
    const response = await api.get(`/publishers/top?limit=${limit}`);
    return response.data;
  },

  async searchPublishers(searchTerm: string): Promise<ApiResponse<Publisher[]>> {
    const response = await api.get(`/publishers/search?q=${searchTerm}`);
    return response.data;
  },

  async getPublishersBySpecialty(specialty: string): Promise<ApiResponse<Publisher[]>> {
    const response = await api.get(`/publishers/specialty/${specialty}`);
    return response.data;
  },

  async getPublisherBySlug(slug: string): Promise<ApiResponse<Publisher>> {
    const response = await api.get(`/publishers/slug/${slug}`);
    return response.data;
  },

  async createPublisher(data: Partial<Publisher>): Promise<ApiResponse<Publisher>> {
    const response = await api.post('/publishers', data);
    return response.data;
  },

  async updatePublisher(id: string, data: Partial<Publisher>): Promise<ApiResponse<Publisher>> {
    const response = await api.put(`/publishers/${id}`, data);
    return response.data;
  },

  async deletePublisher(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/publishers/${id}`);
    return response.data;
  },

  // Book Series
  async getBookSeries(page = 1, limit = 20): Promise<ApiResponse<{ data: BookSeries[] }>> {
    const response = await api.get(`/book-series?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getSeriesStats(): Promise<ApiResponse<any>> {
    const response = await api.get('/book-series/stats');
    return response.data;
  },

  async getActiveSeries(): Promise<ApiResponse<BookSeries[]>> {
    const response = await api.get('/book-series/active');
    return response.data;
  },

  async getOngoingSeries(): Promise<ApiResponse<BookSeries[]>> {
    const response = await api.get('/book-series/ongoing');
    return response.data;
  },

  async getTopSeries(limit = 10): Promise<ApiResponse<BookSeries[]>> {
    const response = await api.get(`/book-series/top?limit=${limit}`);
    return response.data;
  },

  async searchSeries(searchTerm: string): Promise<ApiResponse<BookSeries[]>> {
    const response = await api.get(`/book-series/search?q=${searchTerm}`);
    return response.data;
  },

  async getSeriesByAuthor(authorId: string): Promise<ApiResponse<BookSeries[]>> {
    const response = await api.get(`/book-series/author/${authorId}`);
    return response.data;
  },

  async getSeriesByPublisher(publisherId: string): Promise<ApiResponse<BookSeries[]>> {
    const response = await api.get(`/book-series/publisher/${publisherId}`);
    return response.data;
  },

  async getSeriesByGenre(genre: string): Promise<ApiResponse<BookSeries[]>> {
    const response = await api.get(`/book-series/genre/${genre}`);
    return response.data;
  },

  async getSeriesByAgeGroup(ageGroup: string): Promise<ApiResponse<BookSeries[]>> {
    const response = await api.get(`/book-series/age-group/${ageGroup}`);
    return response.data;
  },

  async getSeriesBySlug(slug: string): Promise<ApiResponse<BookSeries>> {
    const response = await api.get(`/book-series/slug/${slug}`);
    return response.data;
  },

  async createBookSeries(data: Partial<BookSeries>): Promise<ApiResponse<BookSeries>> {
    const response = await api.post('/book-series', data);
    return response.data;
  },

  async updateBookSeries(id: string, data: Partial<BookSeries>): Promise<ApiResponse<BookSeries>> {
    const response = await api.put(`/book-series/${id}`, data);
    return response.data;
  },

  async addBookToSeries(id: string, data: { bookId: string; order: number; title: string }): Promise<ApiResponse<BookSeries>> {
    const response = await api.put(`/book-series/${id}/add-book`, data);
    return response.data;
  },

  async removeBookFromSeries(id: string, data: { bookId: string }): Promise<ApiResponse<BookSeries>> {
    const response = await api.put(`/book-series/${id}/remove-book`, data);
    return response.data;
  },

  async deleteBookSeries(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/book-series/${id}`);
    return response.data;
  },
};