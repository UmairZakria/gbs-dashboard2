import api from './api';
import { ApiResponse } from '../types';

export interface BookSpecification {
  _id?: string;
  productId: string;
  isbn?: string;
  isbn13?: string;
  isbn10?: string;
  format: 'hardcover' | 'paperback' | 'ebook' | 'audiobook';
  language: 'english' | 'hindi' | 'bengali' | 'tamil' | 'telugu' | 'marathi' | 'gujarati' | 'kannada' | 'malayalam' | 'punjabi';
  pageCount?: number;
  dimensions?: { length: number; width: number; height: number };
  weight?: number;
  publicationDate?: string;
  edition?: string;
  volume?: string;
  seriesName?: string;
  seriesNumber?: number;
  ageGroup?: string;
  gradeLevel?: string;
  subject?: string;
  board?: string;
  syllabusYear?: string;
  authors?: string[];
  editors?: string[];
  illustrators?: string[];
  publisher?: string;
  publisherId?: string;
  authorId?: string;
  bookSeriesId?: string;
  tableOfContents?: string;
  summary?: string;
  keyFeatures?: string[];
  learningObjectives?: string[];
  prerequisites?: string;
  targetAudience?: string;
  coverImageUrl?: string;
  samplePages?: string[];
  hasDigitalVersion: boolean;
  hasAudioVersion: boolean;
  digitalFormats?: Record<string, string>;
  awards?: string[];
  reviews?: { averageRating?: number; totalReviews?: number; reviews?: string[] };
  additionalSpecs?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export const bookSpecificationService = {
  async getBookSpecifications(page = 1, limit = 20): Promise<ApiResponse<any>> {
    const response = await api.get(`/book-specifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getBookSpecification(id: string): Promise<ApiResponse<BookSpecification>> {
    const response = await api.get(`/book-specifications/${id}`);
    return response.data;
  },

  async getBookSpecificationByProductId(productId: string): Promise<ApiResponse<BookSpecification>> {
    const response = await api.get(`/book-specifications/product/${productId}`);
    return response.data;
  },

  async getBookSpecificationByISBN(isbn: string): Promise<ApiResponse<BookSpecification>> {
    const response = await api.get(`/book-specifications/isbn/${isbn}`);
    return response.data;
  },

  async searchBookSpecifications(query: string, page = 1, limit = 20): Promise<ApiResponse<any>> {
    const response = await api.get(`/book-specifications/search?q=${query}&page=${page}&limit=${limit}`);
    return response.data;
  },

  async getBookSpecificationsBySubject(subject: string): Promise<ApiResponse<BookSpecification[]>> {
    const response = await api.get(`/book-specifications/subject/${subject}`);
    return response.data;
  },

  async getBookSpecificationsByGrade(gradeLevel: string): Promise<ApiResponse<BookSpecification[]>> {
    const response = await api.get(`/book-specifications/grade/${gradeLevel}`);
    return response.data;
  },

  async getBookSpecificationsByBoard(board: string): Promise<ApiResponse<BookSpecification[]>> {
    const response = await api.get(`/book-specifications/board/${board}`);
    return response.data;
  },

  async createBookSpecification(data: Partial<BookSpecification>): Promise<ApiResponse<BookSpecification>> {
    const response = await api.post('/book-specifications', data);
    return response.data;
  },

  async updateBookSpecification(id: string, data: Partial<BookSpecification>): Promise<ApiResponse<BookSpecification>> {
    const response = await api.put(`/book-specifications/${id}`, data);
    return response.data;
  },

  async deleteBookSpecification(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/book-specifications/${id}`);
    return response.data;
  },
};
