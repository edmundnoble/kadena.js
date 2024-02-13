import type { TableState, TreeGridState } from '@react-stately/table';
import type { GridNode } from '@react-types/grid';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import {
  mergeProps,
  useFocusRing,
  useTableCell,
  useTableRow,
} from 'react-aria';
import { tableDataCell, tableRow } from './Table.css';

interface ITableRowProps<T> {
  item: GridNode<T>;
  state: TableState<T> | TreeGridState<T>;
  children: ReactNode;
}

export function TableRow<T extends object>({
  item,
  children,
  state,
}: ITableRowProps<T>) {
  const ref = useRef(null);
  const { rowProps } = useTableRow(
    {
      node: item,
    },
    state,
    ref,
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  return (
    <tr
      className={tableRow}
      {...mergeProps(rowProps, focusProps)}
      data-focused={isFocusVisible || undefined}
      ref={ref}
    >
      {children}
    </tr>
  );
}

interface ITableCellProps<T> {
  cell: GridNode<T>;
  state: TableState<T>;
}

export function TableCell<T extends object>({
  cell,
  state,
}: ITableCellProps<T>) {
  const ref = useRef(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <td
      {...mergeProps(gridCellProps, focusProps)}
      className={tableDataCell}
      data-focused={isFocusVisible || undefined}
      ref={ref}
    >
      {cell.rendered}
    </td>
  );
}
