import 'package:flutter/material.dart';

/// SkinTypeSelectionScreen allows the user to choose their skin type
/// during onboarding. The selected skin type is stored locally in
/// widget state and can be passed back to the onboarding flow or
/// persisted later to the backend.
class SkinTypeSelectionScreen extends StatefulWidget {
  const SkinTypeSelectionScreen({Key? key}) : super(key: key);

  @override
  State<SkinTypeSelectionScreen> createState() =>
      _SkinTypeSelectionScreenState();
}

class _SkinTypeSelectionScreenState extends State<SkinTypeSelectionScreen> {
  String? selectedSkinType; // 'Oily', 'Dry', or 'Combination'

  void _onSkinTypeSelected(String skinType) {
    setState(() {
      selectedSkinType = skinType;
    });

    // TODO: Persist selection to onboarding state / provider / bloc, etc.
    // Example: context.read<OnboardingCubit>().setSkinType(skinType);
  }

  Widget _buildSkinTypeCard({
    required String label,
    required String description,
    required IconData icon,
  }) {
    final bool isSelected = selectedSkinType == label;

    return GestureDetector(
      onTap: () => _onSkinTypeSelected(label),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? Colors.blue.shade50 : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? Colors.blueAccent : Colors.grey.shade300,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Colors.blue.shade100.withOpacity(0.6),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [
                  BoxShadow(
                    color: Colors.grey.shade200,
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 32,
              color: isSelected ? Colors.blueAccent : Colors.grey.shade600,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight:
                          isSelected ? FontWeight.bold : FontWeight.w600,
                      color:
                          isSelected ? Colors.blueAccent : Colors.grey.shade900,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey.shade700,
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              const Icon(
                Icons.check_circle,
                color: Colors.blueAccent,
              ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Your Skin Type'),
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Let’s personalize your routine',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Choose the option that best describes your skin.',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: Colors.grey.shade700,
                ),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: ListView(
                  children: [
                    _buildSkinTypeCard(
                      label: 'Oily',
                      description:
                          'Shiny throughout the day with visible pores and breakouts.',
                      icon: Icons.opacity,
                    ),
                    const SizedBox(height: 16),
                    _buildSkinTypeCard(
                      label: 'Dry',
                      description:
                          'Feels tight, flaky, or rough, especially after cleansing.',
                      icon: Icons.water_drop_outlined,
                    ),
                    const SizedBox(height: 16),
                    _buildSkinTypeCard(
                      label: 'Combination',
                      description:
                          'Oily in the T-zone (forehead, nose, chin) and dry elsewhere.',
                      icon: Icons.grid_view,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: selectedSkinType == null
                      ? null
                      : () {
                          // Example: pop back with result
                          Navigator.of(context).pop(selectedSkinType);
                        },
                  child: const Text('Continue'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

