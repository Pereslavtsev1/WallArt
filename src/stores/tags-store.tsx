'use client';
import { create } from 'zustand';
import { findAllTags } from '@/actions/tag-actions';

type Tag = { id: string; name: string };

type TagStore = {
  tags: Tag[];
  isLoading: boolean;
  fetchTags: () => Promise<void>;
};
