import React, { useState, useEffect } from 'react';
import { BoardItem } from './types/miro';
import { UserProfile, UserPlan } from './types/auth';
import { Dashboard } from './components/dashboard/Dashboard';
import { BoardCanvas } from './components/canvas/BoardCanvas';
import { SalesPage } from './components/sales/SalesPage';
import { AuthPage } from './components/auth/AuthPage';
import { UpgradeModal } from './components/dashboard/UpgradeModal';
import { loadBoards, getBoardById, updateBoard } from './utils/storage';
import { getCurrentUser, logoutUser, updateUserPlan } from './utils/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'sales' | 'auth' | 'dashboard' | 'canvas'>('sales');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getCurrentUser());
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [currentBoard, setCurrentBoard] = useState<BoardItem | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Sync board data when currentBoardId changes
  useEffect(() => {
    if (currentBoardId) {
      const b = getBoardById(currentBoardId);
      if (b) {
        setCurrentBoard(b);
        setCurrentPage('canvas');
      } else {
        setCurrentBoardId(null);
        setCurrentBoard(null);
        setCurrentPage('dashboard');
      }
    }
  }, [currentBoardId]);

  const handleOpenBoard = (boardId: string) => {
    setCurrentBoardId(boardId);
    setCurrentPage('canvas');
  };

  const handleBackToDashboard = () => {
    setCurrentBoardId(null);
    setCurrentBoard(null);
    setCurrentPage('dashboard');
  };

  const handleUpdateCurrentBoard = (updatedBoard: BoardItem) => {
    setCurrentBoard(updatedBoard);
    updateBoard(updatedBoard.id, () => updatedBoard);
  };

  const handleEnterPlatformFromSales = () => {
    setCurrentPage('dashboard');
  };

  const handleOpenAuthPage = (mode: 'login' | 'register') => {
    setAuthInitialMode(mode);
    setCurrentPage('auth');
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(getCurrentUser());
    setCurrentPage('sales');
  };

  const handleUpgradePlan = (plan: UserPlan) => {
    const updated = updateUserPlan(plan);
    setCurrentUser(updated);
  };

  // 1. Full Canvas Page
  if (currentPage === 'canvas' && currentBoard) {
    return (
      <BoardCanvas
        board={currentBoard}
        onBackToDashboard={handleBackToDashboard}
        onUpdateBoard={handleUpdateCurrentBoard}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
      />
    );
  }

  // 2. Full Auth Portal Page
  if (currentPage === 'auth') {
    return (
      <AuthPage
        onBackToSales={() => setCurrentPage('sales')}
        onEnterPlatform={handleAuthSuccess}
        initialMode={authInitialMode}
      />
    );
  }

  // 3. Platform Workspace Dashboard
  if (currentPage === 'dashboard') {
    return (
      <>
        <Dashboard
          user={currentUser}
          onOpenBoard={handleOpenBoard}
          onOpenSalesPage={() => setCurrentPage('sales')}
          onLogout={handleLogout}
          onUpgradePlan={handleUpgradePlan}
        />
        <UpgradeModal
          isOpen={isUpgradeOpen}
          onClose={() => setIsUpgradeOpen(false)}
        />
      </>
    );
  }

  // 4. Default: High-converting Sales / Landing Page with direct entry points
  return (
    <SalesPage
      onEnterPlatform={handleEnterPlatformFromSales}
      onOpenBoard={handleOpenBoard}
    />
  );
}
