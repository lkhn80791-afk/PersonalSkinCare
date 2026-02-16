import 'package:flutter/material.dart';
import 'screens/auth/AuthScreen.dart';

void main() {
  runApp(const PersonalSkinApp());
}

/// PersonalSkinApp is the root widget of the mobile application.
class PersonalSkinApp extends StatelessWidget {
  const PersonalSkinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PersonalSkin',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blueAccent),
        useMaterial3: true,
      ),
      home: const AuthScreen(),
    );
  }
}

