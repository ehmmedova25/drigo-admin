import { useState } from 'react';
import { useDeleteTariffTemplateMutation, useGetTariffTemplatesQuery, useToggleTariffTemplateMutation } from '@/api/endpoints/tariffsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { useAction } from '@/hooks/useAction';
import type { TariffTemplate } from '@/types/tariffs.types';
import { toListState } from '@/utils/queryState';
import { activeStatus, toggleActiveLabel } from '@/utils/status';
import { TemplateFormModal } from './TariffFormModals';
import { TemplateTariffsModal } from './TemplateTariffsModal';

export const TemplatesTab = () => {
  const list = toListState(useGetTariffTemplatesQuery());
  const [toggleTariffTemplate] = useToggleTariffTemplateMutation();
  const [deleteTariffTemplate] = useDeleteTariffTemplateMutation();
  const { run } = useAction();
  const [opened, setOpened] = useState<TariffTemplate | null>(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="template"
        rowKey={(template) => template.id}
        nameOf={(template) => template.name}
        columns={[
          { key: 'name', header: 'Name', render: (template) => template.name },
          { key: 'description', header: 'Description', render: (template) => template.description },
          { key: 'tariffs', header: 'Tariffs', render: (template) => template.tariffs.length },
          { key: 'status', header: 'Status', render: (template) => <StatusBadge status={activeStatus(template.isActive)} /> },
        ]}
        rowActions={(template) => [
          { label: 'Tariffs', onClick: () => setOpened(template) },
          {
            label: toggleActiveLabel(template.isActive),
            onClick: () => run(() => toggleTariffTemplate(template.id).unwrap(), 'Template status changed'),
          },
        ]}
        renderForm={(props) => <TemplateFormModal {...props} />}
        onDelete={(template) => deleteTariffTemplate(template.id).unwrap()}
      />
      {opened && <TemplateTariffsModal template={opened} onClose={() => setOpened(null)} />}
    </>
  );
};
