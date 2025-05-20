// stores/usePersonStore.ts
import { create } from 'zustand'

type SortDirection = 'asc' | 'desc'

interface PersonStore {
  search: string
  sortBy: string
  sortDirection: SortDirection
  setSearch: (search: string) => void
  setSort: (field: string) => void
}

export const usePersonStore = create<PersonStore>((set, get) => ({
  search: '',
  sortBy: 'dni',
  sortDirection: 'desc',
  setSearch: (search) => set({ search }),
  setSort: (field) => {
    const { sortBy, sortDirection } = get()
    if (sortBy === field) {
      set({ sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' })
    } else {
      set({ sortBy: field, sortDirection: 'asc' })
    }
  }
}))
