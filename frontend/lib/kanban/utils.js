import { arrayMove } from '@dnd-kit/sortable';

export function sortByRecent(items = []) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

export function groupByStatus(items = [], statuses = []) {
  const grouped = statuses.reduce((acc, status) => {
    acc[status] = [];
    return acc;
  }, {});

  items.forEach((item) => {
    const status = item.status;
    if (!grouped[status]) {
      grouped[status] = [];
    }
    grouped[status].push(item);
  });

  return grouped;
}

export function moveItemStatus(items, itemId, nextStatus) {
  return items.map((item) =>
    item._id === itemId
      ? {
          ...item,
          status: nextStatus
        }
      : item
  );
}

export function getStatusFromDropTarget(overId, items, statuses) {
  if (!overId) {
    return null;
  }

  const targetId = String(overId);
  if (statuses.includes(targetId)) {
    return targetId;
  }

  const targetItem = items.find((item) => String(item._id) === targetId);
  return targetItem ? targetItem.status : null;
}

export function moveItemForDrop(items, activeId, overId, statuses) {
  const activeKey = String(activeId);
  const overKey = String(overId);

  const activeIndex = items.findIndex((item) => String(item._id) === activeKey);
  if (activeIndex === -1) {
    return items;
  }

  const activeItem = items[activeIndex];
  const targetStatus = getStatusFromDropTarget(overKey, items, statuses);
  if (!targetStatus) {
    return items;
  }

  let nextItems = items;
  if (activeItem.status !== targetStatus) {
    nextItems = moveItemStatus(nextItems, activeKey, targetStatus);
  }

  const nextActiveIndex = nextItems.findIndex((item) => String(item._id) === activeKey);
  const overIndex = nextItems.findIndex((item) => String(item._id) === overKey);

  if (statuses.includes(overKey)) {
    const statusItems = nextItems.filter((item) => item.status === targetStatus && String(item._id) !== activeKey);
    if (statusItems.length === 0) {
      return nextItems;
    }

    const insertAfterId = statusItems[statusItems.length - 1]._id;
    const insertIndex = nextItems.findIndex((item) => String(item._id) === String(insertAfterId));
    return arrayMove(nextItems, nextActiveIndex, insertIndex + 1);
  }

  if (overIndex === -1 || overIndex === nextActiveIndex) {
    return nextItems;
  }

  return arrayMove(nextItems, nextActiveIndex, overIndex);
}
