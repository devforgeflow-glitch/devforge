import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '../src/components/ui/Avatar';

/**
 * Story do componente Avatar
 *
 * Demonstra avatares de usuario com imagem ou fallback.
 *
 * @version 1.0.0
 */
const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Tamanho do avatar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== BASICO =====

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
        alt="Usuario"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const WithBrokenImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/imagem-inexistente.jpg" alt="Usuario" />
      <AvatarFallback>XY</AvatarFallback>
    </Avatar>
  ),
};

// ===== TAMANHOS =====

export const Small: Story = {
  render: () => (
    <Avatar size="sm">
      <AvatarFallback>SM</AvatarFallback>
    </Avatar>
  ),
};

export const Medium: Story = {
  render: () => (
    <Avatar size="md">
      <AvatarFallback>MD</AvatarFallback>
    </Avatar>
  ),
};

export const Large: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarFallback>LG</AvatarFallback>
    </Avatar>
  ),
};

export const ExtraLarge: Story = {
  render: () => (
    <Avatar size="xl">
      <AvatarFallback>XL</AvatarFallback>
    </Avatar>
  ),
};

// ===== CASOS DE USO =====

export const UserList: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-white dark:border-gray-800">
        <AvatarFallback className="bg-blue-500 text-white">AB</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white dark:border-gray-800">
        <AvatarFallback className="bg-green-500 text-white">CD</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white dark:border-gray-800">
        <AvatarFallback className="bg-purple-500 text-white">EF</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white dark:border-gray-800">
        <AvatarFallback className="bg-gray-400 text-white">+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const UserInfo: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
          alt="Joao Silva"
        />
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">Joao Silva</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">joao@email.com</p>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="text-center">
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <p className="mt-2 text-xs text-gray-600">sm</p>
      </div>
      <div className="text-center">
        <Avatar size="md">
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <p className="mt-2 text-xs text-gray-600">md</p>
      </div>
      <div className="text-center">
        <Avatar size="lg">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <p className="mt-2 text-xs text-gray-600">lg</p>
      </div>
      <div className="text-center">
        <Avatar size="xl">
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>
        <p className="mt-2 text-xs text-gray-600">xl</p>
      </div>
    </div>
  ),
};
