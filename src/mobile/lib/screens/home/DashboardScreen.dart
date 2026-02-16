import 'package:flutter/material.dart';
import '../routines/RoutineScreen.dart';

/// DashboardScreen is the main home screen shown after onboarding.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({
    super.key,
    required this.authToken,
    required this.firstName,
    required this.skinType,
  });

  final String authToken;
  final String firstName;
  final String skinType;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('PersonalSkin Dashboard'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Hi, $firstName',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Skin type: $skinType',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              Text(
                'Today\'s routine',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Generate a personalized morning and evening routine based on your profile.',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => RoutineScreen(
                          authToken: authToken,
                          skinType: skinType,
                        ),
                      ),
                    );
                  },
                  child: const Text('View my recommended routine'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

