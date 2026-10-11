import { useState } from 'react';
import { useDeleteStoryMutation, useGetStoriesQuery, useSetStoryStatusMutation } from '@/api/endpoints/promotionsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { useAction } from '@/hooks/useAction';
import type { Story, StoryStatus } from '@/types/promotions.types';
import { formatDate, formatNumber } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { StoryAnalyticsModal } from './DetailModals';
import { StoryFormModal } from './PromotionFormModals';
import styles from './StoriesTab.module.scss';

const NEXT_STATUS: Record<StoryStatus, { status: StoryStatus; label: string }> = {
  Draft: { status: 'Active', label: 'Publish' },
  Active: { status: 'Archived', label: 'Archive' },
  Archived: { status: 'Active', label: 'Restore' },
};

export const StoriesTab = () => {
  const list = toListState(useGetStoriesQuery());
  const [setStoryStatus] = useSetStoryStatusMutation();
  const [deleteStory] = useDeleteStoryMutation();
  const { run } = useAction();
  const [opened, setOpened] = useState<Story | null>(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="story"
        emptyText="No stories"
        rowKey={(story) => story.id}
        nameOf={(story) => story.title}
        onRowClick={setOpened}
        columns={[
          {
            key: 'cover',
            header: '',
            render: (story) => story.items[0] && <img className={styles.thumb} src={story.items[0].mediaUrl} alt="" />,
          },
          { key: 'title', header: 'Title', render: (story) => story.title },
          { key: 'slides', header: 'Slides', render: (story) => story.items.length },
          { key: 'audience', header: 'Audience', render: (story) => story.targetAudience },
          { key: 'views', header: 'Views', render: (story) => formatNumber(story.viewCount) },
          { key: 'created', header: 'Created', render: (story) => formatDate(story.createdAt) },
          { key: 'status', header: 'Status', render: (story) => <StatusBadge status={story.status} /> },
        ]}
        rowActions={(story) => {
          const next = NEXT_STATUS[story.status];
          return [
            {
              label: next.label,
              onClick: () => run(() => setStoryStatus({ id: story.id, status: next.status }).unwrap(), `Story ${next.status.toLowerCase()}`),
            },
          ];
        }}
        renderForm={(props) => <StoryFormModal {...props} />}
        onDelete={(story) => deleteStory(story.id).unwrap()}
      />
      {opened && <StoryAnalyticsModal story={opened} onClose={() => setOpened(null)} />}
    </>
  );
};
