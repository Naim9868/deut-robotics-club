'use client';

import React from 'react';
import {
  Bot, Cpu, Eye, Brain, Wifi, Radio, Plane, Zap, Activity,
  Cog, Wrench, Database, Globe, BarChart3, FlaskConical, Rocket,
  GraduationCap, Lightbulb, Target, Trophy, Star, Hammer, Monitor,
  Smartphone, Speaker, Headphones, Keyboard, CircuitBoard, Gauge,
  TrendingUp, Microscope, Magnet, Atom, Ruler, Battery, BatteryCharging,
  Binary, Server, Cloud, Layers, Triangle, Circle, Hexagon, Compass,
  Navigation, Satellite, Workflow, GitBranch, Code, Terminal, Braces,
  FileCode, Layout, Palette, PenTool, Brush, Camera, Video, Music,
  Gamepad2, Joystick, Tv, Printer, MousePointer, Clapperboard,
  Flame, Droplets, Wind, Sun, Moon, Mountain, TreePine, Leaf,
  Heart, Stethoscope, Shield, Lock, Key, Fingerprint, ScanLine,
  Radar, TowerControl, Truck, Ship, Bike, Car, Bus, Train,
  DollarSign, Briefcase, Users, UserCheck, BookOpen, Library,
  MessageCircle, Phone, Mail, MapPin, Clock, Calendar, Timer,
  RefreshCw, RotateCcw, Repeat, ArrowUpRight, Maximize, Minimize,
  ZoomIn, ZoomOut, Move, Grab, Crosshair, Focus, Scan,
  Settings, Search, Plus, Minus, Check, X, AlertTriangle,
  ChevronRight, ChevronDown, ArrowRight, ArrowLeft, Download,
  Upload, ExternalLink, Link2, Image, FileText, Folder,
  Box, Cuboid, Hexagon as HexagonIcon,
} from 'lucide-react';

/**
 * Map of available Lucide icons.
 * Keys are the icon names stored in the database.
 * Values are the Lucide React components.
 */
export const LUCIDE_ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Bot, Cpu, Eye, Brain, Wifi, Radio, Plane, Zap, Activity,
  Cog, Wrench, Database, Globe, BarChart3, FlaskConical, Rocket,
  GraduationCap, Lightbulb, Target, Trophy, Star, Hammer, Monitor,
  Smartphone, Speaker, Headphones, Keyboard, CircuitBoard, Gauge,
  TrendingUp, Microscope, Magnet, Atom, Ruler, Battery, BatteryCharging,
  Binary, Server, Cloud, Layers, Triangle, Circle, Hexagon, Compass,
  Navigation, Satellite, Workflow, GitBranch, Code, Terminal, Braces,
  FileCode, Layout, Palette, PenTool, Brush, Camera, Video, Music,
  Gamepad2, Joystick, Tv, Printer, MousePointer, Clapperboard,
  Flame, Droplets, Wind, Sun, Moon, Mountain, TreePine, Leaf,
  Heart, Stethoscope, Shield, Lock, Key, Fingerprint, ScanLine,
  Radar, TowerControl, Truck, Ship, Bike, Car, Bus, Train,
  DollarSign, Briefcase, Users, UserCheck, BookOpen, Library,
  MessageCircle, Phone, Mail, MapPin, Clock, Calendar, Timer,
  RefreshCw, RotateCcw, Repeat, ArrowUpRight, Maximize, Minimize,
  ZoomIn, ZoomOut, Move, Grab, Crosshair, Focus, Scan,
  Settings, Search, Plus, Minus, Check, X, AlertTriangle,
  ChevronRight, ChevronDown, ArrowRight, ArrowLeft, Download,
  Upload, ExternalLink, Link2, Image, FileText, Folder, Box, Cuboid,
};

export const LUCIDE_CATEGORIES: Record<string, string[]> = {
  'Robotics & AI': ['Bot', 'Cpu', 'Brain', 'Eye', 'Activity', 'Radar', 'ScanLine', 'Fingerprint', 'CircuitBoard', 'Gauge', 'Settings', 'Navigation'],
  'Hardware': ['Cpu', 'CircuitBoard', 'Binary', 'Server', 'Database', 'Layers', 'Zap', 'Battery', 'BatteryCharging', 'Radio', 'Wifi', 'Box', 'Cuboid'],
  'Software': ['Code', 'Terminal', 'Braces', 'FileCode', 'GitBranch', 'Workflow', 'Layout', 'Monitor', 'Globe', 'Cloud', 'Server', 'FileText', 'Folder'],
  'Flight & Drone': ['Plane', 'Rocket', 'Satellite', 'Navigation', 'Compass', 'TowerControl', 'Sun', 'Moon', 'Wind'],
  'Science': ['FlaskConical', 'Microscope', 'Atom', 'Magnet', 'Brain', 'Lightbulb', 'Leaf', 'TreePine', 'Droplets'],
  'Engineering': ['Cog', 'Wrench', 'Hammer', 'Gauge', 'Ruler', 'Triangle', 'Hexagon', 'Circle', 'Crosshair', 'Maximize', 'Move', 'Grab'],
  'Camera & Vision': ['Camera', 'Video', 'Eye', 'Scan', 'ZoomIn', 'Focus', 'Clapperboard', 'Image'],
  'Communication': ['MessageCircle', 'Phone', 'Mail', 'Radio', 'Speaker', 'Headphones', 'Music', 'Link2', 'ExternalLink'],
  'Data & Analytics': ['BarChart3', 'TrendingUp', 'Database', 'Binary', 'Server', 'Activity', 'Search', 'AlertTriangle'],
  'Learning': ['GraduationCap', 'BookOpen', 'Library', 'PenTool', 'Brush', 'Palette'],
  'General': ['Target', 'Trophy', 'Star', 'Rocket', 'Heart', 'Shield', 'Lock', 'Key', 'Users', 'UserCheck', 'Briefcase', 'DollarSign', 'Calendar', 'Clock', 'Timer', 'MapPin', 'RefreshCw', 'RotateCcw', 'Repeat', 'ArrowUpRight', 'Gamepad2', 'Joystick', 'Printer', 'Truck', 'Car', 'Bike', 'Ship', 'Bus', 'Train', 'MousePointer', 'Tv', 'Plus', 'Minus', 'Check', 'X', 'Download', 'Upload'],
};

interface FocusAreaIconProps {
  /** The icon value: Lucide icon name or image URL */
  icon: string;
  /** The type of icon */
  iconType?: 'lucide' | 'image';
  /** Icon color (applied to lucide icons) */
  color?: string;
  /** Size class string (e.g., 'text-3xl', 'w-16 h-16') */
  className?: string;
}

/**
 * Renders a Focus Area icon based on its type.
 * - lucide: renders a Lucide React icon component
 * - image: renders an <img> tag for uploaded SVG/PNG
 */
export default function FocusAreaIcon({
  icon,
  iconType = 'lucide',
  color = '#e63946',
  className = '',
}: FocusAreaIconProps) {

  // ─── Image Icon (SVG/PNG upload) ─────────────────
  if (iconType === 'image' && icon) {
    return (
      <span className={`inline-flex items-center justify-center ${className} transition-all`}>
        <img
          src={icon}
          alt="Focus area icon"
          className="w-[1em] h-[1em] object-contain"
        />
      </span>
    );
  }

  // ─── Lucide Icon (default) ───────────────────────
  if (icon) {
    const LucideComponent = LUCIDE_ICON_MAP[icon];
    if (LucideComponent) {
      return (
        <span className={`inline-flex items-center justify-center ${className} transition-all`}>
          <LucideComponent
            className="w-[1em] h-[1em]"
            style={{ color }}
          />
        </span>
      );
    }
  }

  // ─── Fallback ────────────────────────────────────
  return (
    <span className={`inline-flex items-center justify-center ${className} transition-all`}>
      <Target className="w-[1em] h-[1em]" style={{ color }} />
    </span>
  );
}
