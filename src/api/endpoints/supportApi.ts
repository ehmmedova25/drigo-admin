import { baseApi } from '@/api/baseApi';
import type { Paged, Query } from '@/api/types';
import { MESSAGES_PAGE_SIZE } from '@/constants/support';
import type { Message, ReplySuggestion, ReplyTemplate, Ticket, TicketContext, TicketDetail, TicketStatus } from '@/types/support.types';

const ticket = (id: number) => `/supports/${id}`;

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTickets: build.query<Paged<Ticket>, Query>({
      query: (params) => ({ url: '/supports', params }),
      providesTags: ['Support'],
    }),
    getTicket: build.query<TicketDetail, number>({
      query: (id) => ticket(id),
      providesTags: ['Support'],
    }),
    getTicketMessages: build.query<Message[], number>({
      query: (id) => ({ url: `${ticket(id)}/messages`, params: { pageSize: MESSAGES_PAGE_SIZE } }),
      transformResponse: (res: Paged<Message>) => res.data,
      providesTags: ['Support'],
    }),
    getTicketContext: build.query<TicketContext, number>({
      query: (id) => `${ticket(id)}/context`,
      providesTags: ['Support'],
    }),
    replyToTicket: build.mutation<Message, { id: number; message: string }>({
      query: ({ id, message }) => ({ url: `${ticket(id)}/messages`, method: 'POST', body: { message } }),
      invalidatesTags: ['Support', 'Dashboard'],
    }),
    markTicketRead: build.mutation<unknown, number>({
      query: (id) => ({ url: `${ticket(id)}/mark-read`, method: 'POST' }),
      invalidatesTags: ['Support', 'Dashboard'],
    }),
    setTicketStatus: build.mutation<unknown, { id: number; status: TicketStatus }>({
      query: ({ id, status }) => ({ url: `${ticket(id)}/status`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Support', 'Dashboard'],
    }),
    assignTicketToMe: build.mutation<unknown, number>({
      query: (id) => ({ url: `${ticket(id)}/assign`, method: 'PUT' }),
      invalidatesTags: ['Support', 'Dashboard'],
    }),
    setTicketMuted: build.mutation<unknown, { id: number; isMuted: boolean }>({
      query: ({ id, isMuted }) => ({ url: `${ticket(id)}/mute`, method: 'PUT', body: { isMuted } }),
      invalidatesTags: ['Support', 'Dashboard'],
    }),
    getTicketSuggestions: build.query<ReplySuggestion[], number>({
      query: (id) => `${ticket(id)}/ai-suggestions`,
      providesTags: ['Support'],
    }),
    getReplyTemplates: build.query<ReplyTemplate[], void>({
      query: () => '/support-templates',
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useGetTicketMessagesQuery,
  useGetTicketContextQuery,
  useReplyToTicketMutation,
  useMarkTicketReadMutation,
  useSetTicketStatusMutation,
  useAssignTicketToMeMutation,
  useSetTicketMutedMutation,
  useGetTicketSuggestionsQuery,
  useGetReplyTemplatesQuery,
} = supportApi;
